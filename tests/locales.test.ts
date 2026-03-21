import { describe, expect, test } from 'bun:test'
import { AUDIBLE_LOCALES } from '../src/locales'
import type { AudibleLocale } from '../src/types'

describe('AUDIBLE_LOCALES', () => {
  const allLocales: AudibleLocale[] = [
    'fr',
    'com',
    'co.uk',
    'de',
    'it',
    'es',
    'ca',
    'com.au',
    'in',
    'co.jp',
  ]

  test('covers all 10 locales', () => {
    expect(Object.keys(AUDIBLE_LOCALES)).toHaveLength(10)
  })

  for (const locale of allLocales) {
    test(`${locale} has domain, marketplaceId, and countryCode`, () => {
      const config = AUDIBLE_LOCALES[locale]
      expect(config.domain).toBeTruthy()
      expect(config.marketplaceId).toBeTruthy()
      expect(config.countryCode).toBeTruthy()
    })
  }
})
