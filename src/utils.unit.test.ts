import { describe, expect, test } from 'bun:test'
import { Buffer } from 'node:buffer'
import { base64nopad, base64url, toHexString, toQueryString } from './utils'

describe('base64url', () => {
  test('replaces + with - and / with _ and strips padding', () => {
    const buffer = Buffer.from([0xfb, 0xef, 0xbe])
    const result = base64url(buffer)

    expect(result).not.toContain('+')
    expect(result).not.toContain('/')
    expect(result).not.toContain('=')
  })

  test('encodes empty buffer', () => {
    expect(base64url(Buffer.alloc(0))).toBe('')
  })
})

describe('base64nopad', () => {
  test('strips trailing = padding', () => {
    const buffer = Buffer.from('A')
    const result = base64nopad(buffer)

    expect(result).not.toContain('=')
    expect(result).toBe('QQ')
  })

  test('strips padding but preserves standard base64 chars', () => {
    const buffer = Buffer.from([0xfb, 0xef, 0xbe])
    const result = base64nopad(buffer)

    expect(result).not.toContain('=')
    expect(result).toBe(buffer.toString('base64').replace(/=+$/, ''))
  })
})

describe('toHexString', () => {
  test('converts string to hex', () => {
    expect(toHexString('AB')).toBe('4142')
  })

  test('handles special characters', () => {
    expect(toHexString('#')).toBe('23')
  })
})

describe('toQueryString', () => {
  test('encodes spaces, accents and reserved characters', () => {
    expect(toQueryString({ author: 'Matt Dinniman', keywords: 'Nous sommes Légion & co' })).toBe(
      'author=Matt%20Dinniman&keywords=Nous%20sommes%20L%C3%A9gion%20%26%20co',
    )
  })

  test('keeps the commas of a response group list readable to Audible', () => {
    expect(toQueryString({ response_groups: 'series,rating' })).toBe(
      'response_groups=series%2Crating',
    )
  })
})
