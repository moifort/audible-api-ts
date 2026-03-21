import type { AudibleLocale, LocaleConfig } from './types.js'

/** All supported Audible marketplace configurations indexed by locale */
export const AUDIBLE_LOCALES: Record<AudibleLocale, LocaleConfig> = {
  fr: { domain: 'fr', marketplaceId: 'A2728XDNODOQ8T', countryCode: 'fr' },
  com: { domain: 'com', marketplaceId: 'AF2M0KC94RCEA', countryCode: 'us' },
  'co.uk': { domain: 'co.uk', marketplaceId: 'A2I9A3Q2GNFNGQ', countryCode: 'uk' },
  de: { domain: 'de', marketplaceId: 'AN7V1F1VY261K', countryCode: 'de' },
  it: { domain: 'it', marketplaceId: 'A2N7FU2W2BU2ZC', countryCode: 'it' },
  es: { domain: 'es', marketplaceId: 'ALMIKO4SZCSAR', countryCode: 'es' },
  ca: { domain: 'ca', marketplaceId: 'A2CQZ5RBY40XE', countryCode: 'ca' },
  'com.au': { domain: 'com.au', marketplaceId: 'AN7EY7DTAW63G', countryCode: 'au' },
  in: { domain: 'in', marketplaceId: 'AJO3FBRUE6J4S', countryCode: 'in' },
  'co.jp': { domain: 'co.jp', marketplaceId: 'A1QAP3MOU4173J', countryCode: 'jp' },
} as const
