import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { loadCredentials } from './credentials'
import { verify } from './library'

setDefaultTimeout(30_000)

describe('auth integration', () => {
  test('verify does not throw with credentials (auto-refreshed)', async () => {
    await expect(verify(loadCredentials())).resolves.toBeUndefined()
  })
})
