// Auth

// Data
export { catalog, product, search } from './catalog.js'
// Types
export type { AudibleGenre } from './categories.js'
export { GENRE_CATEGORIES, resolveGenreId } from './categories.js'
export { login, refresh, register } from './client.js'
export { lastPositions, library, verify, wishlist } from './library.js'
export {
  deregister,
  fairPlayKey,
  LicenseDeniedError,
  playbackLicense,
  savePosition,
  widevineKey,
} from './playback.js'
// Config
export { AUDIBLE_LOCALES } from './locales.js'
export type {
  AudibleCategory,
  AudibleChapter,
  AudibleCookie,
  AudibleCredentials,
  AudibleItem,
  AudibleLocale,
  AudibleRating,
  AudibleRelationship,
  AuthSession,
  CatalogOptions,
  CategoryLadder,
  ConsumptionType,
  DrmType,
  LastPosition,
  ListeningStatus,
  LocaleConfig,
  PlaybackLicense,
  RatingDistribution,
  SearchOptions,
} from './types.js'
