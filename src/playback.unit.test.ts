import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { generateKeyPairSync } from 'node:crypto'
import {
  LicenseDeniedError,
  fairPlayKey,
  flattenChapters,
  playbackLicense,
  savePosition,
  toPlaybackLicense,
} from './playback'
import type { AudibleCredentials } from './types'

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 1024 })

const credentials: AudibleCredentials = {
  accessToken: 'access',
  refreshToken: 'refresh',
  adpToken: 'adp',
  devicePrivateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }).toString(),
  serial: 'SERIAL',
  locale: 'fr',
  expiresAt: new Date(Date.now() + 3_600_000),
}

const granted = {
  content_license: {
    status_code: 'Granted',
    asin: 'B0TEST0001',
    acr: 'CR!ACR',
    drm_type: 'FairPlay',
    license_response: 'https://example.cloudfront.net/title.m3u8',
    certificate: 'Q0VSVA==',
    content_metadata: {
      chapter_info: {
        runtime_length_ms: 3_000_000,
        chapters: [
          { title: 'Ouverture', start_offset_ms: 0, length_ms: 20_000 },
          {
            title: 'Première partie',
            start_offset_ms: 20_000,
            length_ms: 0,
            chapters: [
              { title: 'Chapitre 1', start_offset_ms: 20_000, length_ms: 1_000_000 },
              { title: 'Chapitre 2', start_offset_ms: 1_020_000, length_ms: 1_980_000 },
            ],
          },
        ],
      },
      content_reference: { codec: 'mp4a.40.42', content_format: 'M4A_XHE' },
      last_position_heard: {
        status: 'Exists',
        position_ms: 61_000,
        last_updated: '2026-11-18 10:04:01.809',
      },
    },
  },
}

describe('flattenChapters', () => {
  test('lists a part’s chapters after it and drops an empty part', () => {
    const chapters = flattenChapters(granted.content_license.content_metadata.chapter_info.chapters)

    expect(chapters.map(({ title }) => title)).toEqual(['Ouverture', 'Chapitre 1', 'Chapitre 2'])
    expect(chapters[2]).toEqual({ title: 'Chapitre 2', startMs: 1_020_000, lengthMs: 1_980_000 })
  })

  test('keeps a part that plays something of its own', () => {
    const chapters = flattenChapters([
      {
        title: 'Partie',
        start_offset_ms: 0,
        length_ms: 5_000,
        chapters: [{ title: 'Un', start_offset_ms: 5_000, length_ms: 10_000 }],
      },
    ])

    expect(chapters.map(({ title }) => title)).toEqual(['Partie', 'Un'])
  })
})

describe('toPlaybackLicense', () => {
  test('reads a granted FairPlay licence', () => {
    const license = toPlaybackLicense(granted)

    expect(license.asin).toBe('B0TEST0001')
    expect(license.acr).toBe('CR!ACR')
    expect(license.streamUrl).toBe('https://example.cloudfront.net/title.m3u8')
    expect(license.certificate).toBe('Q0VSVA==')
    expect(license.durationMs).toBe(3_000_000)
    expect(license.codec).toBe('mp4a.40.42')
    expect(license.chapters).toHaveLength(3)
    expect(license.lastPosition?.positionMs).toBe(61_000)
    expect(license.lastPosition?.lastUpdatedAt).toEqual(new Date('2026-11-18T10:04:01.809Z'))
  })

  test('has no position for a title never opened', () => {
    const license = toPlaybackLicense({
      content_license: {
        ...granted.content_license,
        content_metadata: {
          ...granted.content_license.content_metadata,
          last_position_heard: { status: 'DoesNotExist' },
        },
      },
    })

    expect(license.lastPosition).toBeUndefined()
  })

  test('throws Audible’s reasons when the licence is denied', () => {
    const denied = () =>
      toPlaybackLicense({
        content_license: {
          status_code: 'Denied',
          asin: 'B0TEST0001',
          license_denial_reasons: [{ message: 'Device limit reached', rejectionReason: 'X' }],
        },
      })

    expect(denied).toThrow(LicenseDeniedError)
    expect(denied).toThrow('Device limit reached')
  })

  test('refuses a licence that is not FairPlay', () => {
    expect(() =>
      toPlaybackLicense({
        content_license: { ...granted.content_license, drm_type: 'Adrm' },
      }),
    ).toThrow(LicenseDeniedError)
  })
})

describe('signed writes', () => {
  const calls: { url: string; init: RequestInit }[] = []
  const answer = (status: number, body?: unknown) =>
    spyOn(globalThis, 'fetch').mockImplementation((async (url: string, init: RequestInit) => {
      calls.push({ url, init })
      return new Response(body === undefined ? null : JSON.stringify(body), { status })
    }) as unknown as typeof fetch)

  afterEach(() => {
    calls.length = 0
    ;(globalThis.fetch as unknown as { mockRestore?: () => void }).mockRestore?.()
  })

  test('playbackLicense posts a signed FairPlay request to the marketplace', async () => {
    answer(200, granted)
    const { license } = await playbackLicense(credentials, 'B0TEST0001')

    expect(license.acr).toBe('CR!ACR')
    const [{ url, init }] = calls
    expect(url).toBe('https://api.audible.fr/1.0/content/B0TEST0001/licenserequest')
    expect(init.method).toBe('POST')
    const body = JSON.parse(String(init.body))
    expect(body.consumption_type).toBe('Streaming')
    expect(body.supported_media_features.drm_types).toEqual(['FairPlay'])
    const headers = init.headers as Record<string, string>
    expect(headers['x-adp-token']).toBe('adp')
    expect(headers['x-adp-signature']).toMatch(/:\d{4}-\d{2}-\d{2}T/)
  })

  test('fairPlayKey trades the SPC for the CKC', async () => {
    answer(200, { license: 'Q0tD' })
    const { ckc } = await fairPlayKey(credentials, 'B0TEST0001', 'U1BD')

    expect(ckc).toBe('Q0tD')
    const body = JSON.parse(String(calls[0].init.body))
    expect(body).toEqual({
      licenseChallenge: 'U1BD',
      asin: 'B0TEST0001',
      consumption_type: 'Streaming',
      drm_type: 'FairPlay',
    })
  })

  test('savePosition puts a whole, non-negative position and accepts an empty 204', async () => {
    answer(204)
    await savePosition(credentials, { asin: 'B0TEST0001', acr: 'CR!ACR', positionMs: 1234.6 })

    expect(calls[0].url).toBe('https://api.audible.fr/1.0/lastpositions/B0TEST0001')
    expect(calls[0].init.method).toBe('PUT')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      acr: 'CR!ACR',
      asin: 'B0TEST0001',
      position_ms: 1235,
    })
  })

  test('a refused write says which call and never the body', async () => {
    answer(403, { message: 'Forbidden' })

    await expect(fairPlayKey(credentials, 'B0TEST0001', 'U1BD')).rejects.toThrow(
      'Audible API error: 403',
    )
  })
})
