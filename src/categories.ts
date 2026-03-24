import type { AudibleLocale } from './types.js'

/** Human-readable genre names for catalog search */
export type AudibleGenre =
  | 'science-fiction'
  | 'fantasy'
  | 'science-fiction-fantasy'
  | 'thriller'
  | 'mystery'
  | 'horror'
  | 'romance'
  | 'historical-fiction'
  | 'literary-fiction'
  | 'biography'
  | 'history'
  | 'business'
  | 'self-help'
  | 'science'
  | 'children'
  | 'young-adult'
  | 'comedy'
  | 'erotica'
  | 'religion'
  | 'sports'
  | 'travel'
  | 'lgbtq'

/** Mapping from genre name to locale-specific Audible category ID */
export const GENRE_CATEGORIES: Record<AudibleGenre, Partial<Record<AudibleLocale, string>>> = {
  'science-fiction': {
    fr: '21229020031',
  },
  fantasy: {
    fr: '21229021031',
  },
  'science-fiction-fantasy': {
    fr: '21228885031',
  },
  thriller: {
    fr: '21228906031',
  },
  mystery: {
    fr: '21228905031',
  },
  horror: {
    fr: '21229011031',
  },
  romance: {
    fr: '21228893031',
  },
  'historical-fiction': {
    fr: '21229010031',
  },
  'literary-fiction': {
    fr: '21228884031',
  },
  biography: {
    fr: '21228881031',
  },
  history: {
    fr: '21228890031',
  },
  business: {
    fr: '21228882031',
  },
  'self-help': {
    fr: '21228892031',
  },
  science: {
    fr: '21228897031',
  },
  children: {
    fr: '21228877031',
  },
  'young-adult': {
    fr: '21228895031',
  },
  comedy: {
    fr: '34003928031',
  },
  erotica: {
    fr: '21228894031',
  },
  religion: {
    fr: '21228880031',
  },
  sports: {
    fr: '21228879031',
  },
  travel: {
    fr: '21228891031',
  },
  lgbtq: {
    fr: '21228883031',
  },
}

/**
 * Resolve a genre name to a locale-specific Audible category ID.
 *
 * @throws If the genre is not mapped for the given locale
 */
export const resolveGenreId = (genre: AudibleGenre, locale: AudibleLocale) => {
  const id = GENRE_CATEGORIES[genre]?.[locale]
  if (!id) {
    throw new Error(
      `Genre "${genre}" is not mapped for locale "${locale}". Use categoryId directly or contribute the mapping.`,
    )
  }
  return id
}
