import type { AudibleLocale } from './types.js'

/** Human-readable genre and sub-genre names for catalog search */
export type AudibleGenre =
  // Main genres
  | 'science-fiction'
  | 'fantasy'
  | 'science-fiction-fantasy'
  | 'mystery-thriller-suspense'
  | 'thriller'
  | 'mystery'
  | 'crime-fiction'
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
  | 'fantasy/sword-sorcery'
  | 'fantasy/urban-paranormal'
  // Thriller sub-genres
  | 'thriller/suspense'
  | 'thriller/psychological'
  | 'thriller/domestic'
  | 'thriller/historical'
  // Mystery sub-genres
  | 'mystery/amateur-sleuth'
  | 'mystery/cozy'
  | 'mystery/detective'
  | 'mystery/hard-boiled'
  | 'mystery/historical'
  | 'mystery/noir'
  | 'mystery/police-procedural'
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
  | 'literary-fiction/fiction'
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
  | 'children/mystery'
  | 'children/science-fiction-fantasy'
  | 'children/fantasy'
  | 'children/science-fiction'
  // Young Adult sub-genres
  | 'young-adult/literary-fiction'
  | 'young-adult/romance'
  | 'young-adult/science-fiction-fantasy'
  | 'young-adult/fantasy'
  | 'young-adult/science-fiction'
  | 'young-adult/thriller'

/**
 * Mapping from genre name to locale-specific Audible category ID.
 *
 * Every id is checked against the live catalogue by `categories.int.test.ts`, which
 * asserts the name Audible gives it. A category can sit under several parents, so
 * the id is the same wherever the store shows it.
 */
export const GENRE_CATEGORIES: Record<AudibleGenre, Partial<Record<AudibleLocale, string>>> = {
  // Main genres
  'science-fiction': { fr: '21229020031', com: '18580628011' },
  fantasy: { fr: '21229021031', com: '18580607011' },
  'science-fiction-fantasy': { fr: '21228885031', com: '18580606011' },
  'mystery-thriller-suspense': { fr: '21228876031', com: '18574597011' },
  thriller: { fr: '21228906031', com: '18574621011' },
  mystery: { fr: '21228905031', com: '18574606011' },
  'crime-fiction': { fr: '21228907031', com: '18574598011' },
  horror: { fr: '21229011031', com: '18574490011' },
  romance: { fr: '21228893031', com: '18580518011' },
  'historical-fiction': { fr: '21229010031', com: '18574482011' },
  'literary-fiction': { fr: '21228884031', com: '18574426011' },
  biography: { fr: '21228881031', com: '18571951011' },
  history: { fr: '21228890031', com: '18573518011' },
  business: { fr: '21228882031', com: '18572029011' },
  'self-help': { fr: '21228892031', com: '18574784011' },
  science: { fr: '21228897031', com: '18580540011' },
  children: { fr: '21228877031', com: '18572091011' },
  'young-adult': { fr: '21228895031', com: '18580715011' },
  comedy: { fr: '34003928031', com: '24427740011' },
  erotica: { fr: '21228894031', com: '18573351011' },
  religion: { fr: '21228880031', com: '18574839011' },
  sports: { fr: '21228879031', com: '18580648011' },
  travel: { fr: '21228891031', com: '18581095011' },
  lgbtq: { fr: '21228883031', com: '18573743011' },

  // Science Fiction sub-genres
  'science-fiction/adventure': { fr: '21229681031', com: '18580629011' },
  'science-fiction/adaptations': { fr: '21229683031', com: '18580642011' },
  'science-fiction/cyberpunk': { fr: '21229684031', com: '18580633011' },
  'science-fiction/dystopian': { fr: '21229685031', com: '18580635011' },
  'science-fiction/first-contact': { fr: '21229682031', com: '18580636011' },
  'science-fiction/galactic-empire': { fr: '21229693031' },
  'science-fiction/genetic-engineering': { fr: '21229686031', com: '18580638011' },
  'science-fiction/military': { fr: '21229688031', com: '18580641011' },
  'science-fiction/post-apocalyptic': { fr: '21229687031', com: '18580643011' },
  'science-fiction/space-exploration': { fr: '21229689031', com: '18580644011' },
  'science-fiction/space-opera': { fr: '21229694031', com: '18580645011' },

  // Fantasy sub-genres
  'fantasy/action-adventure': { fr: '21229712031', com: '18580608011' },
  'fantasy/adaptations': { fr: '21229708031', com: '18580621011' },
  'fantasy/dragons': { fr: '21229709031', com: '18580613011' },
  'fantasy/epic': { fr: '21229701031', com: '18580615011' },
  'fantasy/historical': { fr: '21229700031', com: '18580618011' },
  'fantasy/sword-sorcery': { fr: '21229713031', com: '18580627011' },
  'fantasy/urban-paranormal': { fr: '21229711031', com: '18580622011' },

  // Thriller sub-genres
  'thriller/suspense': { fr: '21229158031', com: '18574639011' },
  'thriller/psychological': { fr: '21229165031', com: '18574631011' },
  'thriller/domestic': { fr: '21229163031', com: '18574624011' },
  'thriller/historical': { fr: '21229168031', com: '18574627011' },

  // Mystery sub-genres
  'mystery/amateur-sleuth': { fr: '21229145031', com: '18574607011' },
  'mystery/cozy': { fr: '21229150031', com: '18574609011' },
  'mystery/detective': { fr: '21229148031', com: '18574618011' },
  'mystery/hard-boiled': { fr: '21229153031', com: '18574614011' },
  'mystery/historical': { fr: '21229155031', com: '18574615011' },
  'mystery/noir': { fr: '21229177031', com: '18574602011' },
  'mystery/police-procedural': { fr: '21229144031', com: '18574617011' },
  'mystery/private-investigator': { fr: '21229148031', com: '18574618011' },
  'mystery/traditional': { fr: '21229152031', com: '18574619011' },

  // Romance sub-genres
  'romance/action-adventure': { fr: '21229096031', com: '18580519011' },
  'romance/comedy': { fr: '21229087031', com: '18580535011' },
  'romance/contemporary': { fr: '21230152031', com: '18580522011' },
  'romance/fantasy': { fr: '21229095031', com: '18580523011' },
  'romance/historical': { fr: '21229093031', com: '18580524011' },
  'romance/paranormal': { fr: '21229088031', com: '18580534011' },
  'romance/science-fiction': { fr: '21229085031', com: '18580537011' },
  'romance/sports': { fr: '21229086031', com: '18580538011' },
  'romance/suspense': { fr: '21229090031', com: '18580536011' },

  // Literary Fiction sub-genres
  'literary-fiction/action-adventure': { fr: '21229016031', com: '18574427011' },
  'literary-fiction/classics': { fr: '21229007031', com: '18574449011' },
  'literary-fiction/coming-of-age': { fr: '21229655031', com: '18574461011' },
  'literary-fiction/contemporary': { fr: '21229657031', com: '18574462011' },
  'literary-fiction/drama': { fr: '21229017031', com: '18574450011' },
  'literary-fiction/family-life': { fr: '21229670031', com: '18574465011' },
  'literary-fiction/fiction': { fr: '21229019031', com: '18574456011' },
  'literary-fiction/historical': { fr: '21229010031', com: '18574482011' },
  'literary-fiction/sagas': { fr: '21229654031', com: '18574476011' },
  'literary-fiction/sea-adventures': { fr: '21229673031', com: '18574434011' },
  'literary-fiction/world-literature': { fr: '21229018031', com: '18574521011' },

  // Biography sub-genres
  'biography/entertainment': { fr: '21228985031', com: '18571984011' },

  // History sub-genres
  'history/europe': { fr: '21229067031', com: '18573582011' },

  // Children sub-genres
  'children/action-adventure': { fr: '21228913031', com: '18572092011' },
  'children/mystery': { fr: '21228927031', com: '18572548011' },
  'children/science-fiction-fantasy': { fr: '21228926031', com: '18572586011' },
  'children/fantasy': { fr: '21229338031', com: '18572587011' },
  'children/science-fiction': { fr: '21229339031', com: '18572593011' },

  // Young Adult sub-genres
  'young-adult/literary-fiction': { fr: '21229110031', com: '18580894011' },
  'young-adult/romance': { fr: '21229117031', com: '18581004011' },
  'young-adult/science-fiction-fantasy': { fr: '21229103031', com: '18581048011' },
  'young-adult/fantasy': { fr: '21230013031', com: '18581049011' },
  'young-adult/science-fiction': { fr: '21230014031', com: '18581062011' },
  'young-adult/thriller': { fr: '21229114031', com: '18580961011' },
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
