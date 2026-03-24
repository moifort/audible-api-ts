import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { AUDIBLE_LOCALES } from './locales.js'
import type { AudibleCookie, AudibleCredentials, AudibleLocale, AuthSession } from './types.js'
import { base64nopad, base64url, toHexString } from './utils.js'

const DEVICE_TYPE = 'A2CZJZGLK2JJVM'
const APP_VERSION = '3.56.2'
const SOFTWARE_VERSION = '35602678'

/**
 * Generate a login URL for the Audible PKCE OAuth flow.
 *
 * Returns the URL to redirect the user to, the session to pass back to `register`,
 * and the cookies to set in the browser before redirecting.
 */
export const login = async (locale: AudibleLocale) => {
  const config = AUDIBLE_LOCALES[locale]

  const codeVerifier = base64url(randomBytes(32))
  const codeChallenge = base64url(createHash('sha256').update(codeVerifier).digest())

  const serial = randomUUID().replace(/-/g, '').toUpperCase()
  const clientId = toHexString(`${serial}#${DEVICE_TYPE}`)

  const session: AuthSession = {
    codeVerifier,
    serial,
    locale,
    createdAt: new Date(),
  }

  const params = new URLSearchParams({
    'openid.oa2.response_type': 'code',
    'openid.oa2.code_challenge_method': 'S256',
    'openid.oa2.code_challenge': codeChallenge,
    'openid.return_to': `https://www.amazon.${config.domain}/ap/maplanding`,
    'openid.assoc_handle': `amzn_audible_ios_${config.countryCode}`,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    pageId: 'amzn_audible_ios',
    accountStatusPolicy: 'P1',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.mode': 'checkid_setup',
    'openid.ns.oa2': 'http://www.amazon.com/ap/ext/oauth/2',
    'openid.oa2.client_id': `device:${clientId}`,
    'openid.ns.pape': 'http://specs.openid.net/extensions/pape/1.0',
    marketPlaceId: config.marketplaceId,
    'openid.oa2.scope': 'device_auth_access',
    forceMobileLayout: 'true',
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.pape.max_auth_age': '0',
  })

  const loginUrl = `https://www.amazon.${config.domain}/ap/signin?${params.toString()}`

  const cookies: AudibleCookie[] = [
    {
      name: 'frc',
      value: base64nopad(randomBytes(313)),
      domain: `.amazon.${config.domain}`,
    },
    {
      name: 'map-md',
      value: base64nopad(
        Buffer.from(
          JSON.stringify({
            device_user_dictionary: [],
            device_registration_data: { software_version: SOFTWARE_VERSION },
            app_identifier: { app_version: APP_VERSION, bundle_id: 'com.audible.iphone' },
          }),
        ),
      ),
      domain: `.amazon.${config.domain}`,
    },
    {
      name: 'amzn-app-id',
      value: 'MAPiOSLib/6.0/ToHideRetailLink',
      domain: `.amazon.${config.domain}`,
    },
  ]

  return { loginUrl, session, cookies } as const
}

/**
 * Complete device registration using the authorization code from the OAuth callback.
 *
 * @param authorizationCode - The code received from the OAuth callback URL
 * @param session - The auth session returned by `login`
 * @returns The credentials to use for all subsequent API calls
 */
export const register = async (authorizationCode: string, session: AuthSession) => {
  const config = AUDIBLE_LOCALES[session.locale]
  const clientId = toHexString(`${session.serial}#${DEVICE_TYPE}`)

  const body = {
    requested_token_type: ['bearer', 'mac_dms', 'website_cookies', 'store_authentication_cookie'],
    cookies: { website_cookies: [], domain: `.amazon.${config.domain}` },
    registration_data: {
      domain: 'Device',
      app_version: APP_VERSION,
      device_serial: session.serial,
      device_type: DEVICE_TYPE,
      device_name:
        '%FIRST_NAME%%FIRST_NAME_POSSESSIVE_STRING%%DUPE_STRATEGY_1ST%Audible for iPhone',
      os_version: '15.0.0',
      software_version: SOFTWARE_VERSION,
      device_model: 'iPhone',
      app_name: 'Audible',
    },
    auth_data: {
      client_id: clientId,
      authorization_code: authorizationCode,
      code_verifier: session.codeVerifier,
      code_algorithm: 'SHA-256',
      client_domain: 'DeviceLegacy',
    },
    requested_extensions: ['device_info', 'customer_info'],
  }

  const response = await fetch(`https://api.amazon.${config.domain}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Device registration failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as {
    response: {
      success: {
        tokens: {
          bearer: { access_token: string; refresh_token: string; expires_in: string }
          mac_dms: { adp_token: string; device_private_key: string }
        }
      }
    }
  }

  const bearer = data.response.success.tokens.bearer
  const macDms = data.response.success.tokens.mac_dms

  return {
    accessToken: bearer.access_token,
    refreshToken: bearer.refresh_token,
    adpToken: macDms.adp_token,
    devicePrivateKey: macDms.device_private_key,
    serial: session.serial,
    locale: session.locale,
    expiresAt: new Date(Date.now() + Number(bearer.expires_in) * 1000),
  } satisfies AudibleCredentials
}

/**
 * Refresh an expired access token using the refresh token.
 *
 * @returns Updated credentials with the new access token and expiration
 */
export const refresh = async (credentials: AudibleCredentials) => {
  const config = AUDIBLE_LOCALES[credentials.locale]

  const response = await fetch(`https://api.amazon.${config.domain}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      app_name: 'Audible',
      app_version: APP_VERSION,
      source_token: credentials.refreshToken,
      requested_token_type: 'access_token',
      source_token_type: 'refresh_token',
    }).toString(),
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as { access_token: string; expires_in: number }

  return {
    ...credentials,
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  } satisfies AudibleCredentials
}
