import { describe, expect, test } from 'bun:test'
import { login } from '../src/client'

describe('login', () => {
  test('returns a valid login URL for the "fr" locale', async () => {
    const { loginUrl, session, cookies } = await login('fr')

    expect(loginUrl).toContain('https://www.amazon.fr/ap/signin')
    expect(loginUrl).toContain('openid.oa2.response_type=code')
    expect(loginUrl).toContain('openid.oa2.code_challenge_method=S256')
    expect(loginUrl).toContain('amzn_audible_ios_fr')
    expect(loginUrl).toContain('A2728XDNODOQ8T')
  })

  test('returns a valid login URL for the "com" locale', async () => {
    const { loginUrl } = await login('com')

    expect(loginUrl).toContain('https://www.amazon.com/ap/signin')
    expect(loginUrl).toContain('amzn_audible_ios_us')
    expect(loginUrl).toContain('AF2M0KC94RCEA')
  })

  test('returns a session with correct locale', async () => {
    const { session } = await login('de')

    expect(session.locale).toBe('de')
    expect(session.codeVerifier).toBeTruthy()
    expect(session.serial).toMatch(/^[A-Z0-9]{32}$/)
    expect(session.createdAt).toBeInstanceOf(Date)
  })

  test('returns 3 cookies with correct domain', async () => {
    const { cookies } = await login('co.uk')

    expect(cookies).toHaveLength(3)
    expect(cookies.map(({ name }) => name)).toEqual(['frc', 'map-md', 'amzn-app-id'])
    cookies.map((cookie) => expect(cookie.domain).toBe('.amazon.co.uk'))
  })

  test('generates unique sessions on each call', async () => {
    const a = await login('fr')
    const b = await login('fr')

    expect(a.session.serial).not.toBe(b.session.serial)
    expect(a.session.codeVerifier).not.toBe(b.session.codeVerifier)
  })
})
