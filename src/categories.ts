import type { AudibleLocale } from './types.js'

/** Human-readable genre and sub-genre names for catalog search */
export type AudibleGenre =
  // Main genres
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
  // Science Fiction sub-genres
  | 'science-fiction/adventure'
  | 'science-fiction/adaptations'
  | 'science-fiction/cyberpunk'
  | 'science-fiction/dystopian'
  | 'science-fiction/first-contact'
  | 'science-fiction/galactic-empire'
  | 'science-fiction/genetic-engineering'
  | 'science-fiction/military'
  | 'science-fiction/post-apocalyptic'
  | 'science-fiction/space-exploration'
  | 'science-fiction/space-opera'
  // Fantasy sub-genres
  | 'fantasy/action-adventure'
  | 'fantasy/adaptations'
  | 'fantasy/dragons'
  | 'fantasy/epic'
  | 'fantasy/historical'
  | 'fantasy/urban-paranormal'
  // Thriller sub-genres
  | 'thriller/suspense'
  | 'thriller/psychological'
  | 'thriller/domestic'
  | 'thriller/historical'
  // Mystery sub-genres
  | 'mystery/amateur-sleuth'
  | 'mystery/detective'
  | 'mystery/historical'
  | 'mystery/noir'
  | 'mystery/private-investigator'
  | 'mystery/traditional'
  // Romance sub-genres
  | 'romance/action-adventure'
  | 'romance/comedy'
  | 'romance/contemporary'
  | 'romance/fantasy'
  | 'romance/historical'
  | 'romance/paranormal'
  | 'romance/science-fiction'
  | 'romance/sports'
  | 'romance/suspense'
  // Literary Fiction sub-genres
  | 'literary-fiction/action-adventure'
  | 'literary-fiction/classics'
  | 'literary-fiction/coming-of-age'
  | 'literary-fiction/contemporary'
  | 'literary-fiction/drama'
  | 'literary-fiction/family-life'
  | 'literary-fiction/historical'
  | 'literary-fiction/sagas'
  | 'literary-fiction/sea-adventures'
  | 'literary-fiction/world-literature'
  // Biography sub-genres
  | 'biography/entertainment'
  // History sub-genres
  | 'history/europe'
  // Children sub-genres
  | 'children/action-adventure'
  // Young Adult sub-genres
  | 'young-adult/literary-fiction'
  | 'young-adult/romance'
  | 'young-adult/science-fiction-fantasy'
  | 'young-adult/thriller'

/** Mapping from genre name to locale-specific Audible category ID */
export const GENRE_CATEGORIES: Record<AudibleGenre, Partial<Record<AudibleLocale, string>>> = {
  // Main genres
  'science-fiction': { fr: '21229020031', com: '18580628011' },
  fantasy: { fr: '21229021031', com: '18580607011' },
  'science-fiction-fantasy': { fr: '21228885031', com: '18580606011' },
  thriller: { fr: '21228906031', com: '18574449011' },
  mystery: { fr: '21228905031', com: '18574427011' },
  horror: { fr: '21229011031', com: '18573211011' },
  romance: { fr: '21228893031', com: '18580518011' },
  'historical-fiction': { fr: '21229010031' },
  'literary-fiction': { fr: '21228884031', com: '18574784011' },
  biography: { fr: '21228881031', com: '18571951011' },
  history: { fr: '21228890031' },
  business: { fr: '21228882031', com: '18571961011' },
  'self-help': { fr: '21228892031', com: '18571967011' },
  science: { fr: '21228897031', com: '18571997011' },
  children: { fr: '21228877031', com: '18572091011' },
  'young-adult': { fr: '21228895031' },
  comedy: { fr: '34003928031', com: '18572049011' },
  erotica: { fr: '21228894031', com: '18573267011' },
  religion: { fr: '21228880031', com: '18574606011' },
  sports: { fr: '21228879031', com: '18574713011' },
  travel: { fr: '21228891031', com: '18574721011' },
  lgbtq: { fr: '21228883031', com: '18573939011' },

  // Science Fiction sub-genres
  'science-fiction/adventure': { fr: '21229681031', com: '18580629011' },
  'science-fiction/adaptations': { fr: '21229683031' },
  'science-fiction/cyberpunk': { fr: '21229684031', com: '18580633011' },
  'science-fiction/dystopian': { fr: '21229685031', com: '18580634011' },
  'science-fiction/first-contact': { fr: '21229682031', com: '18580635011' },
  'science-fiction/galactic-empire': { fr: '21229693031', com: '18580636011' },
  'science-fiction/genetic-engineering': { fr: '21229686031', com: '18580637011' },
  'science-fiction/military': { fr: '21229688031', com: '18580643011' },
  'science-fiction/post-apocalyptic': { fr: '21229687031', com: '18580645011' },
  'science-fiction/space-exploration': { fr: '21229689031', com: '18580647011' },
  'science-fiction/space-opera': { fr: '21229694031', com: '18580648011' },

  // Fantasy sub-genres
  'fantasy/action-adventure': { fr: '21229712031', com: '18580608011' },
  'fantasy/adaptations': { fr: '21229708031' },
  'fantasy/dragons': { fr: '21229709031', com: '18580612011' },
  'fantasy/epic': { fr: '21229701031', com: '18580614011' },
  'fantasy/historical': { fr: '21229700031', com: '18580616011' },
  'fantasy/urban-paranormal': { fr: '21229711031', com: '18580621011' },

  // Thriller sub-genres
  'thriller/suspense': { fr: '21229158031', com: '18574450011' },
  'thriller/psychological': { fr: '21229165031', com: '18574459011' },
  'thriller/domestic': { fr: '21229163031', com: '18574455011' },
  'thriller/historical': { fr: '21229168031', com: '18574456011' },

  // Mystery sub-genres
  'mystery/amateur-sleuth': { fr: '21229145031', com: '18574430011' },
  'mystery/detective': { fr: '21229148031' },
  'mystery/historical': { fr: '21229155031', com: '18574435011' },
  'mystery/noir': { fr: '21229177031', com: '18574434011' },
  'mystery/private-investigator': { fr: '21229148031', com: '18574439011' },
  'mystery/traditional': { fr: '21229152031', com: '18574443011' },

  // Romance sub-genres
  'romance/action-adventure': { fr: '21229096031' },
  'romance/comedy': { fr: '21229087031' },
  'romance/contemporary': { fr: '21230152031' },
  'romance/fantasy': { fr: '21229095031' },
  'romance/historical': { fr: '21229093031' },
  'romance/paranormal': { fr: '21229088031' },
  'romance/science-fiction': { fr: '21229085031' },
  'romance/sports': { fr: '21229086031' },
  'romance/suspense': { fr: '21229090031' },

  // Literary Fiction sub-genres
  'literary-fiction/action-adventure': { fr: '21230085031' },
  'literary-fiction/classics': { fr: '21229007031' },
  'literary-fiction/coming-of-age': { fr: '21230090031' },
  'literary-fiction/contemporary': { fr: '21229657031' },
  'literary-fiction/drama': { fr: '21229017031' },
  'literary-fiction/family-life': { fr: '21229670031' },
  'literary-fiction/historical': { fr: '21229010031' },
  'literary-fiction/sagas': { fr: '21229654031' },
  'literary-fiction/sea-adventures': { fr: '21229673031' },
  'literary-fiction/world-literature': { fr: '21229018031' },

  // Biography sub-genres
  'biography/entertainment': { fr: '21228985031' },

  // History sub-genres
  'history/europe': { fr: '21229067031' },

  // Children sub-genres
  'children/action-adventure': { fr: '21228913031' },

  // Young Adult sub-genres
  'young-adult/literary-fiction': { fr: '21229110031' },
  'young-adult/romance': { fr: '21229117031' },
  'young-adult/science-fiction-fantasy': { fr: '21229103031' },
  'young-adult/thriller': { fr: '21229114031' },
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
