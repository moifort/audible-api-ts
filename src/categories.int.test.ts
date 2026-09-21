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
  'science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },
  fantasy: { fr: 'Fantasy', com: 'Fantasy' },
  'science-fiction-fantasy': { fr: 'Science-Fiction et fantasy', com: 'Science Fiction & Fantasy' },
  'mystery-thriller-suspense': {
    fr: 'Policier, thrillers et œuvres à suspense',
    com: 'Mystery, Thriller & Suspense',
  },
  thriller: { fr: 'Thrillers et romans à suspense', com: 'Thriller & Suspense' },
  mystery: { fr: 'Policier', com: 'Mystery' },
  'crime-fiction': { fr: 'Fiction criminelle', com: 'Crime Fiction' },
  horror: { fr: 'Horreur', com: 'Horror' },
  romance: { fr: 'Romance', com: 'Romance' },
  'historical-fiction': { fr: 'Fiction historique', com: 'Historical Fiction' },
  'literary-fiction': { fr: 'Littérature, romans et fiction', com: 'Literature & Fiction' },
  biography: { fr: 'Biographies et mémoires', com: 'Biographies & Memoirs' },
  history: { fr: 'Histoire', com: 'History' },
  business: { fr: 'Business et carrière', com: 'Business & Careers' },
  'self-help': {
    fr: 'Développement personnel, relations et parentalité',
    com: 'Relationships, Parenting & Personal Development',
  },
  science: { fr: 'Sciences exactes', com: 'Science & Engineering' },
  children: { fr: 'Jeunesse', com: "Children's Audiobooks" },
  'young-adult': { fr: 'Adolescents et jeunes adultes', com: 'Teen & Young Adult' },
  comedy: { fr: 'Comédie et humour', com: 'Comedy & Humor' },
  erotica: { fr: 'Érotisme', com: 'Erotica' },
  religion: { fr: 'Religion et spiritualité', com: 'Religion & Spirituality' },
  sports: { fr: 'Sports et loisirs', com: 'Sports & Outdoors' },
  travel: { fr: 'Voyage et tourisme', com: 'Travel & Tourism' },
  lgbtq: { fr: 'LGBT', com: 'LGBTQ+' },

  // Science Fiction sub-genres
  'science-fiction/adventure': { fr: 'Aventure', com: 'Adventure' },
  'science-fiction/adaptations': { fr: 'Adaptations', com: 'Movie, TV & Video Game Tie-Ins' },
  'science-fiction/cyberpunk': { fr: 'Cyberpunk', com: 'Cyberpunk' },
  'science-fiction/dystopian': { fr: 'Dystopique', com: 'Dystopian' },
  'science-fiction/first-contact': { fr: 'Premier contact', com: 'First Contact' },
  'science-fiction/galactic-empire': { fr: 'Empire galactique' },
  'science-fiction/genetic-engineering': { fr: 'Génie génétique', com: 'Genetic Engineering' },
  'science-fiction/military': { fr: 'Militaire', com: 'Military' },
  'science-fiction/post-apocalyptic': { fr: 'Post-apocalyptique', com: 'Post-Apocalyptic' },
  'science-fiction/space-exploration': { fr: 'Exploration spatiale', com: 'Space Exploration' },
  'science-fiction/space-opera': { fr: 'Space-opera', com: 'Space Opera' },

  // Fantasy sub-genres
  'fantasy/action-adventure': { fr: 'Action et aventure', com: 'Action & Adventure' },
  'fantasy/adaptations': { fr: 'Adaptations', com: 'Movie, TV & Video Game Tie-Ins' },
  'fantasy/dragons': { fr: 'Dragons et créatures mythiques', com: 'Dragons & Mythical Creatures' },
  'fantasy/epic': { fr: 'Épique', com: 'Epic' },
  'fantasy/historical': { fr: 'Historique', com: 'Historical' },
  'fantasy/sword-sorcery': { fr: 'Sorcellerie et épées', com: 'Sword & Sorcery' },
  'fantasy/urban-paranormal': { fr: 'Urbain et paranormal', com: 'Paranormal & Urban' },

  // Thriller sub-genres
  'thriller/suspense': { fr: 'Suspense', com: 'Suspense' },
  'thriller/psychological': { fr: 'Psychologie', com: 'Psychological' },
  'thriller/domestic': { fr: 'Thrillers domestiques', com: 'Domestic Thrillers' },
  'thriller/historical': { fr: 'Historique', com: 'Historical' },

  // Mystery sub-genres
  'mystery/amateur-sleuth': { fr: 'Détectives amateurs', com: 'Amateur Sleuths' },
  'mystery/cozy': { fr: 'Cozy', com: 'Cozy' },
  'mystery/detective': { fr: 'Détectives privés', com: 'Private Investigators' },
  'mystery/hard-boiled': { fr: 'Dur à cuire', com: 'Hard-Boiled' },
  'mystery/historical': { fr: 'Historique', com: 'Historical' },
  'mystery/noir': { fr: 'Roman noir', com: 'Noir' },
  'mystery/police-procedural': { fr: 'Polars', com: 'Police Procedurals' },
  'mystery/private-investigator': { fr: 'Détectives privés', com: 'Private Investigators' },
  'mystery/traditional': { fr: 'Détectives traditionnels', com: 'Traditional Detectives' },

  // Romance sub-genres
  'romance/action-adventure': { fr: 'Action et Aventure', com: 'Action & Adventure' },
  'romance/comedy': { fr: 'Comédie romantique', com: 'Romantic Comedy' },
  'romance/contemporary': { fr: 'Contemporain', com: 'Contemporary' },
  'romance/fantasy': { fr: 'Fantasy', com: 'Fantasy' },
  'romance/historical': { fr: 'Historique', com: 'Historical' },
  'romance/paranormal': { fr: 'Paranormal', com: 'Paranormal' },
  'romance/science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },
  'romance/sports': { fr: 'Sports', com: 'Sports' },
  'romance/suspense': { fr: 'Suspense romantique', com: 'Romantic Suspense' },

  // Literary Fiction sub-genres
  'literary-fiction/action-adventure': { fr: 'Action et aventure', com: 'Action & Adventure' },
  'literary-fiction/classics': { fr: 'Classiques', com: 'Classics' },
  'literary-fiction/coming-of-age': { fr: "Passage à l'âge adulte", com: 'Coming of Age' },
  'literary-fiction/contemporary': { fr: 'Fiction contemporaine', com: 'Contemporary Fiction' },
  'literary-fiction/drama': { fr: 'Drames et pièces de théâtre', com: 'Drama & Plays' },
  'literary-fiction/family-life': { fr: 'Vie de famille', com: 'Family Life' },
  'literary-fiction/fiction': { fr: 'Fiction', com: 'Genre Fiction' },
  'literary-fiction/historical': { fr: 'Fiction historique', com: 'Historical Fiction' },
  'literary-fiction/sagas': { fr: 'Sagas', com: 'Sagas' },
  'literary-fiction/sea-adventures': { fr: 'Aventures maritimes', com: 'Sea Adventures' },
  'literary-fiction/world-literature': { fr: 'Littérature du monde', com: 'World Literature' },

  // Biography sub-genres
  'biography/entertainment': {
    fr: 'Divertissement et célébrités',
    com: 'Entertainment & Celebrities',
  },

  // History sub-genres
  'history/europe': { fr: 'Europe', com: 'Europe' },

  // Children sub-genres
  'children/action-adventure': { fr: 'Action et aventure', com: 'Action & Adventure' },
  'children/mystery': { fr: 'Policier et suspense', com: 'Mystery & Suspense' },
  'children/science-fiction-fantasy': {
    fr: 'Science-fiction et fantasy',
    com: 'Science Fiction & Fantasy',
  },
  'children/fantasy': { fr: 'Fantasy et magie', com: 'Fantasy & Magic' },
  'children/science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },

  // Young Adult sub-genres
  'young-adult/literary-fiction': { fr: 'Roman et littérature', com: 'Literature & Fiction' },
  'young-adult/romance': { fr: 'Roman d’amour', com: 'Romance' },
  'young-adult/science-fiction-fantasy': {
    fr: 'Science-fiction et fantasy',
    com: 'Science Fiction & Fantasy',
  },
  'young-adult/fantasy': { fr: 'Fantasy', com: 'Fantasy' },
  'young-adult/science-fiction': { fr: 'Science-fiction', com: 'Science Fiction' },
  'young-adult/thriller': {
    fr: 'Policier, thrillers et œuvres à suspense',
    com: 'Mystery, Thriller & Suspense',
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
