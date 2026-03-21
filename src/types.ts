/** Supported Audible marketplace locales */
export type AudibleLocale =
  | 'fr'
  | 'com'
  | 'co.uk'
  | 'de'
  | 'it'
  | 'es'
  | 'ca'
  | 'com.au'
  | 'in'
  | 'co.jp'

/** Marketplace configuration for a given locale */
export type LocaleConfig = {
  domain: string
  marketplaceId: string
  countryCode: string
}

/** Credentials obtained after device registration */
export type AudibleCredentials = {
  accessToken: string
  refreshToken: string
  adpToken: string
  devicePrivateKey: string
  serial: string
  locale: AudibleLocale
  expiresAt: Date
}

/** An audiobook item from Audible's catalog */
export type AudibleItem = {
  asin: string
  title: string
  authors: string[]
  narrators: string[]
  durationMinutes: number
  publisher?: string
  language?: string
  releaseDate?: Date
  coverUrl?: string
  series?: { name: string; position?: number }
  finishedAt?: Date
}

/** PKCE auth session — returned by generateLoginUrl, passed back to registerDevice */
export type AuthSession = {
  codeVerifier: string
  serial: string
  locale: AudibleLocale
  createdAt: Date
}

/** Cookie to set in the browser before redirecting to the login URL */
export type AudibleCookie = {
  name: string
  value: string
  domain: string
}
