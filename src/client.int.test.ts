import { describe, expect, setDefaultTimeout, test } from 'bun:test'

setDefaultTimeout(30_000)

import { refresh } from './client'
import { loadCredentials } from './credentials'
import { verify } from './library'

describe('auth integration', () => {
  test('refresh returns credentials with new token and future expiration', async () => {
    const credentials = loadCredentials()
    const updated = await refresh(credentials)

    expect(updated.accessToken).toBeTruthy()
    expect(updated.accessToken).not.toBe(credentials.accessToken)
    expect(updated.expiresAt).toBeInstanceOf(Date)
    expect(updated.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(updated.refreshToken).toBe(credentials.refreshToken)
    expect(updated.locale).toBe(credentials.locale)
  })

  test('verify does not throw with fresh credentials', async () => {
    const credentials = loadCredentials()
    const fresh = await refresh(credentials)

    await expect(verify(fresh)).resolves.toBeUndefined()
  })
})
