import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { type AudibleGenre, GENRE_CATEGORIES } from './categories'
import type { AudibleLocale } from './types'

setDefaultTimeout(60_000)

/**
 * The name each mapped category carries on the live catalogue, per locale.
 *
 * Written out by hand on purpose: an id shifted by one row still answers with a
 * perfectly valid category, and only its name gives it away — `thriller` once
 * pointed at "Classics" on audible.com and nothing failed. The category endpoint
 * is public, so this runs without credentials.
 */
const EXPECTED_NAMES: Record<AudibleGenre, Partial<Record<AudibleLocale, string>>> = {
  // Main genres
  'science-fiction': { fr: 'Science-fiction', com: 'Science Fiction', 'co.uk': 'Science Fiction' },
  fantasy: { fr: 'Fantasy', com: 'Fantasy', 'co.uk': 'Fantasy' },
  'science-fiction-fantasy': {
    fr: 'Science-Fiction et fantasy',
    com: 'Science Fiction & Fantasy',
    'co.uk': 'Science Fiction & Fantasy',
  },
  'mystery-thriller-suspense': {
    fr: 'Policier, thrillers et œuvres à suspense',
    com: 'Mystery, Thriller & Suspense',
    'co.uk': 'Mystery, Thriller & Suspense',
  },
  thriller: {
    fr: 'Thrillers et romans à suspense',
    com: 'Thriller & Suspense',
    'co.uk': 'Thriller & Suspense',
  },
  mystery: { fr: 'Policier', com: 'Mystery', 'co.uk': 'Mystery' },
  'crime-fiction': { fr: 'Fiction criminelle', com: 'Crime Fiction', 'co.uk': 'Crime Fiction' },
  horror: { fr: 'Horreur', com: 'Horror', 'co.uk': 'Horror' },
  romance: { fr: 'Romance', com: 'Romance', 'co.uk': 'Romance' },
  'historical-fiction': {
    fr: 'Fiction historique',
    com: 'Historical Fiction',
    'co.uk': 'Historical Fiction',
  },
  'literary-fiction': {
    fr: 'Littérature, romans et fiction',
    com: 'Literature & Fiction',
    'co.uk': 'Literature & Fiction',
  },
  biography: {
    fr: 'Biographies et mémoires',
    com: 'Biographies & Memoirs',
    'co.uk': 'Biographies & Memoirs',
  },
  history: { fr: 'Histoire', com: 'History', 'co.uk': 'History' },
  business: {
    fr: 'Business et carrière',
    com: 'Business & Careers',
    'co.uk': 'Business & Careers',
  },
  'self-help': {
    fr: 'Développement personnel, relations et parentalité',
    com: 'Relationships, Parenting & Personal Development',
    'co.uk': 'Relationships, Parenting & Personal Development',
  },
  science: {
    fr: 'Sciences exactes',
    com: 'Science & Engineering',
    'co.uk': 'Science & Engineering',
  },
  children: { fr: 'Jeunesse', com: "Children's Audiobooks", 'co.uk': "Children's Audiobooks" },
  'young-adult': {
    fr: 'Adolescents et jeunes adultes',
    com: 'Teen & Young Adult',
    'co.uk': 'Teen & Young Adult',
  },
  comedy: { fr: 'Comédie et humour', com: 'Comedy & Humor', 'co.uk': 'Comedy & Humour' },
  erotica: { fr: 'Érotisme', com: 'Erotica', 'co.uk': 'Erotica' },
  religion: {
    fr: 'Religion et spiritualité',
    com: 'Religion & Spirituality',
    'co.uk': 'Religion & Spirituality',
  },
  sports: { fr: 'Sports et loisirs', com: 'Sports & Outdoors', 'co.uk': 'Sports & Outdoors' },
  travel: { fr: 'Voyage et tourisme', com: 'Travel & Tourism', 'co.uk': 'Travel & Tourism' },
  lgbtq: { fr: 'LGBT', com: 'LGBTQ+', 'co.uk': 'LGBTQ+' },

  // Science Fiction sub-genres
  'science-fiction/adventure': { fr: 'Aventure', com: 'Adventure', 'co.uk': 'Adventure' },
  'science-fiction/adaptations': {
    fr: 'Adaptations',
    com: 'Movie, TV & Video Game Tie-Ins',
    'co.uk': 'Movie, TV & Video Game Tie-Ins',
  },
  'science-fiction/cyberpunk': { fr: 'Cyberpunk', com: 'Cyberpunk' },
  'science-fiction/dystopian': { fr: 'Dystopique', com: 'Dystopian', 'co.uk': 'Dystopian' },
  'science-fiction/first-contact': {
    fr: 'Premier contact',
    com: 'First Contact',
    'co.uk': 'First Contact',
  },
  'science-fiction/galactic-empire': { fr: 'Empire galactique' },
  'science-fiction/genetic-engineering': {
    fr: 'Génie génétique',
    com: 'Genetic Engineering',
    'co.uk': 'Genetic Engineering',
  },
  'science-fiction/military': { fr: 'Militaire', com: 'Military', 'co.uk': 'Military' },
  'science-fiction/post-apocalyptic': {
    fr: 'Post-apocalyptique',
    com: 'Post-Apocalyptic',
    'co.uk': 'Post-Apocalyptic',
  },
  'science-fiction/space-exploration': {
    fr: 'Exploration spatiale',
    com: 'Space Exploration',
    'co.uk': 'Space Exploration',
  },
  'science-fiction/space-opera': { fr: 'Space-opera', com: 'Space Opera', 'co.uk': 'Space Opera' },

  // Fantasy sub-genres
  'fantasy/action-adventure': {
    fr: 'Action et aventure',
    com: 'Action & Adventure',
    'co.uk': 'Action & Adventure',
  },
  'fantasy/adaptations': {
    fr: 'Adaptations',
    com: 'Movie, TV & Video Game Tie-Ins',
    'co.uk': 'Movie, TV & Video Game Tie-Ins',
  },
  'fantasy/dragons': {
    fr: 'Dragons et créatures mythiques',
    com: 'Dragons & Mythical Creatures',
    'co.uk': 'Dragons & Mythical Creatures',
  },
  'fantasy/epic': { fr: 'Épique', com: 'Epic', 'co.uk': 'Epic' },
  'fantasy/historical': { fr: 'Historique', com: 'Historical', 'co.uk': 'Historical' },
  'fantasy/sword-sorcery': {
    fr: 'Sorcellerie et épées',
    com: 'Sword & Sorcery',
    'co.uk': 'Sword & Sorcery',
  },
  'fantasy/urban-paranormal': { fr: 'Urbain et paranormal', com: 'Paranormal & Urban' },

  // Thriller sub-genres
  'thriller/suspense': { fr: 'Suspense', com: 'Suspense', 'co.uk': 'Suspense' },
  'thriller/psychological': { fr: 'Psychologie', com: 'Psychological', 'co.uk': 'Psychological' },
  'thriller/domestic': {
    fr: 'Thrillers domestiques',
    com: 'Domestic Thrillers',
    'co.uk': 'Domestic Thrillers',
  },
  'thriller/historical': { fr: 'Historique', com: 'Historical', 'co.uk': 'Historical' },

  // Mystery sub-genres
  'mystery/amateur-sleuth': {
    fr: 'Détectives amateurs',
    com: 'Amateur Sleuths',
    'co.uk': 'Amateur Sleuths',
  },
  'mystery/cozy': { fr: 'Cozy', com: 'Cozy', 'co.uk': 'Cosy' },
  'mystery/detective': {
    fr: 'Détectives privés',
    com: 'Private Investigators',
    'co.uk': 'Private Investigators',
  },
  'mystery/hard-boiled': { fr: 'Dur à cuire', com: 'Hard-Boiled' },
  'mystery/historical': { fr: 'Historique', com: 'Historical', 'co.uk': 'Historical' },
  'mystery/noir': { fr: 'Roman noir', com: 'Noir' },
  'mystery/police-procedural': {
    fr: 'Polars',
    com: 'Police Procedurals',
    'co.uk': 'Police Procedurals',
  },
  'mystery/private-investigator': {
    fr: 'Détectives privés',
    com: 'Private Investigators',
    'co.uk': 'Private Investigators',
  },
  'mystery/traditional': {
    fr: 'Détectives traditionnels',
    com: 'Traditional Detectives',
    'co.uk': 'Traditional Detectives',
  },

  // Romance sub-genres
  'romance/action-adventure': {
    fr: 'Action et Aventure',
    com: 'Action & Adventure',
    'co.uk': 'Action & Adventure',
  },
  'romance/comedy': {
    fr: 'Comédie romantique',
    com: 'Romantic Comedy',
    'co.uk': 'Romantic Comedy',
  },
  'romance/contemporary': { fr: 'Contemporain', com: 'Contemporary', 'co.uk': 'Contemporary' },
  'romance/fantasy': { fr: 'Fantasy', com: 'Fantasy', 'co.uk': 'Fantasy' },
  'romance/historical': { fr: 'Historique', com: 'Historical', 'co.uk': 'Historical' },
  'romance/paranormal': { fr: 'Paranormal', com: 'Paranormal', 'co.uk': 'Paranormal' },
  'romance/science-fiction': {
    fr: 'Science-fiction',
    com: 'Science Fiction',
    'co.uk': 'Science Fiction',
  },
  'romance/sports': { fr: 'Sports', com: 'Sports', 'co.uk': 'Sports' },
  'romance/suspense': {
    fr: 'Suspense romantique',
    com: 'Romantic Suspense',
    'co.uk': 'Romantic Suspense',
  },

  // Literary Fiction sub-genres
  'literary-fiction/action-adventure': {
    fr: 'Action et aventure',
    com: 'Action & Adventure',
    'co.uk': 'Action & Adventure',
  },
  'literary-fiction/classics': { fr: 'Classiques', com: 'Classics', 'co.uk': 'Classics' },
  'literary-fiction/coming-of-age': {
    fr: "Passage à l'âge adulte",
    com: 'Coming of Age',
    'co.uk': 'Coming of Age',
  },
  'literary-fiction/contemporary': {
    fr: 'Fiction contemporaine',
    com: 'Contemporary Fiction',
    'co.uk': 'Contemporary Fiction',
  },
  'literary-fiction/drama': {
    fr: 'Drames et pièces de théâtre',
    com: 'Drama & Plays',
    'co.uk': 'Drama & Plays',
  },
  'literary-fiction/family-life': {
    fr: 'Vie de famille',
    com: 'Family Life',
    'co.uk': 'Family Life',
  },
  'literary-fiction/fiction': { fr: 'Fiction', com: 'Genre Fiction', 'co.uk': 'Genre Fiction' },
  'literary-fiction/historical': {
    fr: 'Fiction historique',
    com: 'Historical Fiction',
    'co.uk': 'Historical Fiction',
  },
  'literary-fiction/sagas': { fr: 'Sagas', com: 'Sagas' },
  'literary-fiction/sea-adventures': {
    fr: 'Aventures maritimes',
    com: 'Sea Adventures',
    'co.uk': 'Sea Adventures',
  },
  'literary-fiction/world-literature': {
    fr: 'Littérature du monde',
    com: 'World Literature',
    'co.uk': 'World Literature',
  },

  // Biography sub-genres
  'biography/entertainment': {
    fr: 'Divertissement et célébrités',
    com: 'Entertainment & Celebrities',
    'co.uk': 'Entertainment & Celebrities',
  },

  // History sub-genres
  'history/europe': { fr: 'Europe', com: 'Europe', 'co.uk': 'Europe' },

  // Children sub-genres
  'children/action-adventure': {
    fr: 'Action et aventure',
    com: 'Action & Adventure',
    'co.uk': 'Action & Adventure',
  },
  'children/mystery': {
    fr: 'Policier et suspense',
    com: 'Mystery & Suspense',
    'co.uk': 'Mystery & Suspense',
  },
  'children/science-fiction-fantasy': {
    fr: 'Science-fiction et fantasy',
    com: 'Science Fiction & Fantasy',
    'co.uk': 'Science Fiction & Fantasy',
  },
  'children/fantasy': { fr: 'Fantasy et magie', com: 'Fantasy & Magic' },
  'children/science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },

  // Young Adult sub-genres
  'young-adult/literary-fiction': {
    fr: 'Roman et littérature',
    com: 'Literature & Fiction',
    'co.uk': 'Literature & Fiction',
  },
  'young-adult/romance': { fr: 'Roman d’amour', com: 'Romance', 'co.uk': 'Romance' },
  'young-adult/science-fiction-fantasy': {
    fr: 'Science-fiction et fantasy',
    com: 'Science Fiction & Fantasy',
    'co.uk': 'Science Fiction & Fantasy',
  },
  'young-adult/fantasy': { fr: 'Fantasy', com: 'Fantasy' },
  'young-adult/science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },
  'young-adult/thriller': {
    fr: 'Policier, thrillers et œuvres à suspense',
    com: 'Mystery, Thriller & Suspense',
    'co.uk': 'Mystery, Thriller & Suspense',
  },
}

const nameOf = async (locale: AudibleLocale, id: string) => {
  const response = await fetch(`https://api.audible.${locale}/1.0/catalog/categories/${id}`)
  const body = (await response.json()) as { category?: { name?: string } }
  return body.category?.name
}

const entries = Object.entries(GENRE_CATEGORIES).flatMap(([genre, ids]) =>
  Object.entries(ids).map(([locale, id]) => ({
    genre: genre as AudibleGenre,
    locale: locale as AudibleLocale,
    id,
  })),
)

describe('genre categories integration', () => {
  test('every mapped locale has an expected name, and nothing more', () => {
    const mapped = entries.map(({ genre, locale }) => `${genre}@${locale}`).sort()
    const named = Object.entries(EXPECTED_NAMES)
      .flatMap(([genre, names]) => Object.keys(names).map((locale) => `${genre}@${locale}`))
      .sort()
    expect(named).toEqual(mapped)
  })

  test.each(entries)('$genre on $locale is the category Audible names so', async (entry) => {
    expect(await nameOf(entry.locale, entry.id)).toBe(EXPECTED_NAMES[entry.genre][entry.locale])
  })
})
