import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { loadCredentials } from './credentials'
import { lastPositions, library } from './library'
import { playbackLicense, savePosition } from './playback'

setDefaultTimeout(60_000)

/** The title the account listened to last: the one sure to have a position. */
const latestTitle = async () => {
  const credentials = loadCredentials()
  const { items, credentials: fresh } = await library(credentials)
  const { positions } = await lastPositions(
    fresh,
    items.map(({ asin }) => asin),
  )
  const [latest] = [...positions].sort((a, b) => +b.lastUpdatedAt - +a.lastUpdatedAt)
  if (!latest) throw new Error('the account has never listened to anything')
  return { credentials: fresh, latest }
}

describe('playback integration', () => {
  test('playbackLicense grants a FairPlay stream with chapters and position', async () => {
    const { credentials, latest } = await latestTitle()
    const { license } = await playbackLicense(credentials, latest.asin)

    expect(license.asin).toBe(latest.asin)
    expect(license.streamUrl).toStartWith('https://')
    expect(license.certificate.length).toBeGreaterThan(100)
    expect(license.acr).toBeTruthy()
    expect(license.durationMs).toBeGreaterThan(0)
    expect(license.chapters.length).toBeGreaterThan(0)
    expect(license.lastPosition?.positionMs).toBe(latest.positionMs)
  })

  test('savePosition rewrites the saved position, unchanged', async () => {
    const { credentials, latest } = await latestTitle()
    const { license, credentials: fresh } = await playbackLicense(credentials, latest.asin)
    await savePosition(fresh, {
      asin: latest.asin,
      acr: license.acr,
      positionMs: latest.positionMs,
    })
    const { positions } = await lastPositions(fresh, [latest.asin])

    expect(positions[0]?.positionMs).toBe(latest.positionMs)
    expect(+positions[0].lastUpdatedAt).toBeGreaterThanOrEqual(+latest.lastUpdatedAt)
  })
})
