import { audibleSend } from './fetch.js'
import { AUDIBLE_LOCALES } from './locales.js'
import { drmLicenseResponseSchema, licenseResponseSchema } from './schemas.js'
import type {
  AudibleChapter,
  AudibleCredentials,
  ConsumptionType,
  DrmType,
  PlaybackLicense,
} from './types.js'

/** The codecs each platform's own player decodes: Audible picks the best one it
 *  holds for the title among them. Apple's player takes them all; Android only
 *  promises AAC and, since Android 9, xHE-AAC. */
const CODECS: Record<DrmType, string[]> = {
  FairPlay: ['mp4a.40.2', 'mp4a.40.42', 'ec+3', 'ac-4'],
  Widevine: ['mp4a.40.2', 'mp4a.40.42'],
}

const LICENSE_GROUPS = 'chapter_info,content_reference,last_position_heard,certificate'

/** Audible dates a position as `2026-09-16 20:55:15.357`, no zone, in UTC. */
const utcDateOf = (value: string) => new Date(`${value.replace(' ', 'T')}Z`)

type RawChapter = NonNullable<
  NonNullable<
    NonNullable<
      ReturnType<typeof licenseResponseSchema.parse>['content_license']['content_metadata']
    >['chapter_info']
  >['chapters']
>[number]

/** The chapters in playing order, a part's own chapters right after it. A part
 *  whose own stretch is empty adds nothing to step through and is left out. */
export const flattenChapters = (chapters: readonly RawChapter[]): AudibleChapter[] =>
  chapters.flatMap((chapter) => [
    ...(chapter.length_ms > 0
      ? [
          {
            title: chapter.title,
            startMs: chapter.start_offset_ms,
            lengthMs: chapter.length_ms,
          },
        ]
      : []),
    ...flattenChapters(chapter.chapters ?? []),
  ])

/** Thrown when Audible refuses a licence: a title the account does not own, a
 *  device over Amazon's licence quota, a region. `reasons` carries Audible's own
 *  words, which name no secret. */
export class LicenseDeniedError extends Error {
  readonly asin: string
  readonly status: string
  readonly reasons: string[]

  constructor(asin: string, status: string, reasons: string[]) {
    super(
      `Audible denied the licence for ${asin}: ${status}${reasons.length ? ` (${reasons.join('; ')})` : ''}`,
    )
    this.name = 'LicenseDeniedError'
    this.asin = asin
    this.status = status
    this.reasons = reasons
  }
}

/** Read a granted licence into what the platform's player needs. */
export const toPlaybackLicense = (raw: unknown, drm: DrmType = 'FairPlay'): PlaybackLicense => {
  const { content_license: license } = licenseResponseSchema.parse(raw)
  const reasons = (license.license_denial_reasons ?? []).flatMap(({ message, rejectionReason }) =>
    message ? [message] : rejectionReason ? [rejectionReason] : [],
  )
  if (license.status_code !== 'Granted') {
    throw new LicenseDeniedError(license.asin, license.status_code, reasons)
  }
  if (license.drm_type !== drm || !license.license_response || !license.certificate) {
    throw new LicenseDeniedError(license.asin, `Not${drm}`, reasons)
  }
  if (!license.acr) throw new LicenseDeniedError(license.asin, 'NoContentReference', reasons)

  const metadata = license.content_metadata
  const info = metadata?.chapter_info
  const heard = metadata?.last_position_heard
  return {
    asin: license.asin,
    acr: license.acr,
    drm,
    streamUrl: license.license_response,
    certificate: license.certificate,
    durationMs: info?.runtime_length_ms ?? 0,
    chapters: flattenChapters(info?.chapters ?? []),
    codec: metadata?.content_reference?.codec ?? undefined,
    lastPosition:
      heard?.status === 'Exists' && heard.last_updated
        ? { positionMs: heard.position_ms ?? 0, lastUpdatedAt: utcDateOf(heard.last_updated) }
        : undefined,
  }
}

/**
 * Ask Audible for a licence to play a title the account owns, in the DRM of the
 * platform that will play it.
 *
 * `FairPlay` (the default) answers an HLS stream (SAMPLE-AES, `skd://` keys)
 * that Apple's AVFoundation plays as it is: the key for each `skd://` URI is
 * fetched with {@link fairPlayKey}. `Widevine` answers a DASH manifest (CENC,
 * the Widevine `pssh` in it) that Android's MediaDrm plays as it is: its key
 * requests are answered with {@link widevineKey}. Nothing is decrypted outside
 * the platform's own DRM. The licence also carries the chapters and the
 * position Audible last saved for the title.
 * Credentials are auto-refreshed if expired.
 *
 * @throws {LicenseDeniedError} When Audible does not grant a licence in that DRM
 * @returns The licence and the (potentially refreshed) credentials
 */
export const playbackLicense = async (
  credentials: AudibleCredentials,
  asin: string,
  {
    consumption = 'Streaming',
    drm = 'FairPlay',
  }: { consumption?: ConsumptionType; drm?: DrmType } = {},
) => {
  const { data, credentials: fresh } = await audibleSend<unknown>(
    'POST',
    `/content/${encodeURIComponent(asin)}/licenserequest`,
    credentials,
    {
      quality: 'High',
      consumption_type: consumption,
      response_groups: LICENSE_GROUPS,
      spatial: false,
      supported_media_features: { codecs: CODECS[drm], drm_types: [drm] },
    },
  )
  return { license: toPlaybackLicense(data, drm), credentials: fresh }
}

/**
 * Trade the player's FairPlay key request (SPC) for the content key (CKC).
 *
 * The SPC is what `AVContentKeyRequest.makeStreamingContentKeyRequestData`
 * produces from the licence's certificate and the `skd://` URI (without its
 * scheme); the CKC goes back to `AVContentKeyResponse(fairPlayStreamingKeyResponseData:)`.
 * Both travel base64-encoded. Neither is a usable key outside Apple's player.
 * Credentials are auto-refreshed if expired.
 *
 * @returns The CKC, base64, and the (potentially refreshed) credentials
 */
export const fairPlayKey = async (
  credentials: AudibleCredentials,
  asin: string,
  spc: string,
  { consumption = 'Streaming' }: { consumption?: ConsumptionType } = {},
) => {
  const { data, credentials: fresh } = await audibleSend<unknown>(
    'POST',
    `/content/${encodeURIComponent(asin)}/drmlicense`,
    credentials,
    { licenseChallenge: spc, asin, consumption_type: consumption, drm_type: 'FairPlay' },
  )
  return { ckc: drmLicenseResponseSchema.parse(data).license, credentials: fresh }
}

/**
 * Answer a Widevine key request from Android's MediaDrm with Audible's licence.
 *
 * The challenge is the `data` of `MediaDrm.KeyRequest` (what Media3's
 * `MediaDrmCallback.executeKeyRequest` receives); the licence goes back to the
 * player as that callback's answer. Both travel base64-encoded. Neither is a
 * usable key outside the device's Widevine module.
 * Credentials are auto-refreshed if expired.
 *
 * @returns The Widevine licence, base64, and the (potentially refreshed) credentials
 */
export const widevineKey = async (
  credentials: AudibleCredentials,
  asin: string,
  challenge: string,
  { consumption = 'Streaming' }: { consumption?: ConsumptionType } = {},
) => {
  const { data, credentials: fresh } = await audibleSend<unknown>(
    'POST',
    `/content/${encodeURIComponent(asin)}/drmlicense`,
    credentials,
    { licenseChallenge: challenge, asin, consumption_type: consumption, drm_type: 'Widevine' },
  )
  return { license: drmLicenseResponseSchema.parse(data).license, credentials: fresh }
}

/**
 * Save where the listener stopped, as Audible's own players do: the position
 * follows the account to every app and device. `acr` is the content reference
 * of the licence the title was played from.
 * Credentials are auto-refreshed if expired.
 *
 * @returns The (potentially refreshed) credentials
 */
export const savePosition = async (
  credentials: AudibleCredentials,
  { asin, acr, positionMs }: { asin: string; acr: string; positionMs: number },
) => {
  const { credentials: fresh } = await audibleSend<unknown>(
    'PUT',
    `/lastpositions/${encodeURIComponent(asin)}`,
    credentials,
    { acr, asin, position_ms: Math.max(0, Math.round(positionMs)) },
  )
  return { credentials: fresh }
}

/**
 * Remove this device from the Amazon account, as "Deregister" does on the
 * account's devices page. The credentials stop working for good.
 */
export const deregister = async (credentials: AudibleCredentials) => {
  const config = AUDIBLE_LOCALES[credentials.locale]
  const response = await fetch(`https://api.amazon.${config.domain}/auth/deregister`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deregister_all_existing_accounts: false }),
  })
  if (!response.ok) {
    throw new Error(`Device deregistration failed: ${response.status} ${response.statusText}`)
  }
}
