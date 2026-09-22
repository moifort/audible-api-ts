import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { generateKeyPairSync } from 'node:crypto'
import { lastPositions } from './library'
import type { AudibleCredentials } from './types'

/** A device key the signature can really be computed with: the request path,
 *  batching and parsing are what is under test, not the signing, but the call
 *  goes through it all the same. */
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 1024 })
const credentials: AudibleCredentials = {
  accessToken: 'access',
  refreshToken: 'refresh',
  adpToken: '{enc:token}',
  devicePrivateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }).toString(),
  serial: 'SERIAL',
  locale: 'fr',
  expiresAt: new Date('2999-01-01T00:00:00.000Z'),
}

const asinsOf = (url: string) => new URL(url).searchParams.get('asins')?.split(',') ?? []

let requested: string[][] = []
const realFetch = globalThis.fetch

/** Answers every asked ASIN as heard, except those listed as never opened. */
const answering = (neverOpened: readonly string[] = []) => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const asins = asinsOf(url)
    requested.push(asins)
    return Response.json({
      asin_last_position_heard_annots: asins.map((asin) =>
        neverOpened.includes(asin)
          ? { asin, last_position_heard: { status: 'DoesNotExist' } }
          : {
              asin,
              last_position_heard: {
                last_updated: '2026-09-16 20:55:15.357',
                position_ms: 8275705,
                status: 'Exists',
              },
            },
      ),
      response_groups: ['always-returned'],
    })
  }) as typeof fetch
}

beforeEach(() => {
  requested = []
})

afterEach(() => {
  globalThis.fetch = realFetch
})

describe('lastPositions', () => {
  test('answers where the reader last stopped, dated in UTC', async () => {
    answering()

    const { positions } = await lastPositions(credentials, ['B0H8T336DS'])

    expect(positions).toEqual([
      {
        asin: 'B0H8T336DS',
        positionMs: 8275705,
        lastUpdatedAt: new Date('2026-09-16T20:55:15.357Z'),
      },
    ])
    expect(requested).toEqual([['B0H8T336DS']])
  })

  test('leaves out a title the reader never opened', async () => {
    answering(['B0CP6T4WXH'])

    const { positions } = await lastPositions(credentials, ['B0H8T336DS', 'B0CP6T4WXH'])

    expect(positions.map(({ asin }) => asin)).toEqual(['B0H8T336DS'])
  })

  // Audible refuses more than 25 ASINs per call with a 400.
  test('asks in batches of 25 and gathers every answer', async () => {
    answering()
    const asins = Array.from({ length: 60 }, (_, i) => `ASIN${String(i).padStart(6, '0')}`)

    const { positions } = await lastPositions(credentials, asins)

    expect(requested.map((batch) => batch.length)).toEqual([25, 25, 10])
    expect(positions.map(({ asin }) => asin)).toEqual(asins)
  })

  test('asks nothing for no ASINs', async () => {
    answering()

    const { positions, credentials: same } = await lastPositions(credentials, [])

    expect(positions).toEqual([])
    expect(requested).toEqual([])
    expect(same).toBe(credentials)
  })
})
