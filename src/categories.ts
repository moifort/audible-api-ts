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
  'science-fiction': { fr: '21229020031', com: '18580628011', 'co.uk': '19378464031' },
  fantasy: { fr: '21229021031', com: '18580607011', 'co.uk': '19378443031' },
  'science-fiction-fantasy': { fr: '21228885031', com: '18580606011', 'co.uk': '19378442031' },
  'mystery-thriller-suspense': { fr: '21228876031', com: '18574597011', 'co.uk': '19378373031' },
  thriller: { fr: '21228906031', com: '18574621011', 'co.uk': '19378399031' },
  mystery: { fr: '21228905031', com: '18574606011', 'co.uk': '19378382031' },
  'crime-fiction': { fr: '21228907031', com: '18574598011', 'co.uk': '19378374031' },
  horror: { fr: '21229011031', com: '18574490011', 'co.uk': '19378324031' },
  romance: { fr: '21228893031', com: '18580518011', 'co.uk': '19378419031' },
  'historical-fiction': { fr: '21229010031', com: '18574482011', 'co.uk': '19378316031' },
  'literary-fiction': { fr: '21228884031', com: '18574426011', 'co.uk': '19378253031' },
  biography: { fr: '21228881031', com: '18571951011', 'co.uk': '19393912031' },
  history: { fr: '21228890031', com: '18573518011', 'co.uk': '19394237031' },
  business: { fr: '21228882031', com: '18572029011', 'co.uk': '19393964031' },
  'self-help': { fr: '21228892031', com: '18574784011', 'co.uk': '19395215031' },
  science: { fr: '21228897031', com: '18580540011', 'co.uk': '19395453031' },
  children: { fr: '21228877031', com: '18572091011', 'co.uk': '19376662031' },
  'young-adult': { fr: '21228895031', com: '18580715011', 'co.uk': '19377559031' },
  comedy: { fr: '34003928031', com: '24427740011', 'co.uk': '34003924031' },
  erotica: { fr: '21228894031', com: '18573351011', 'co.uk': '19378204031' },
  religion: { fr: '21228880031', com: '18574839011', 'co.uk': '19395257031' },
  sports: { fr: '21228879031', com: '18580648011', 'co.uk': '19395513031' },
  travel: { fr: '21228891031', com: '18581095011', 'co.uk': '19395575031' },
  lgbtq: { fr: '21228883031', com: '18573743011', 'co.uk': '19378222031' },

  // Science Fiction sub-genres
  'science-fiction/adventure': { fr: '21229681031', com: '18580629011', 'co.uk': '19378465031' },
  'science-fiction/adaptations': { fr: '21229683031', com: '18580642011', 'co.uk': '19378477031' },
  'science-fiction/cyberpunk': { fr: '21229684031', com: '18580633011' },
  'science-fiction/dystopian': { fr: '21229685031', com: '18580635011', 'co.uk': '19378470031' },
  'science-fiction/first-contact': {
    fr: '21229682031',
    com: '18580636011',
    'co.uk': '19378471031',
  },
  'science-fiction/galactic-empire': { fr: '21229693031' },
  'science-fiction/genetic-engineering': {
    fr: '21229686031',
    com: '18580638011',
    'co.uk': '19378473031',
  },
  'science-fiction/military': { fr: '21229688031', com: '18580641011', 'co.uk': '19378476031' },
  'science-fiction/post-apocalyptic': {
    fr: '21229687031',
    com: '18580643011',
    'co.uk': '19378478031',
  },
  'science-fiction/space-exploration': {
    fr: '21229689031',
    com: '18580644011',
    'co.uk': '19378479031',
  },
  'science-fiction/space-opera': { fr: '21229694031', com: '18580645011', 'co.uk': '19378480031' },

  // Fantasy sub-genres
  'fantasy/action-adventure': { fr: '21229712031', com: '18580608011', 'co.uk': '19378444031' },
  'fantasy/adaptations': { fr: '21229708031', com: '18580621011', 'co.uk': '19378457031' },
  'fantasy/dragons': { fr: '21229709031', com: '18580613011', 'co.uk': '19378449031' },
  'fantasy/epic': { fr: '21229701031', com: '18580615011', 'co.uk': '19378451031' },
  'fantasy/historical': { fr: '21229700031', com: '18580618011', 'co.uk': '19378454031' },
  'fantasy/sword-sorcery': { fr: '21229713031', com: '18580627011', 'co.uk': '19378463031' },
  'fantasy/urban-paranormal': { fr: '21229711031', com: '18580622011' },

  // Thriller sub-genres
  'thriller/suspense': { fr: '21229158031', com: '18574639011', 'co.uk': '19378417031' },
  'thriller/psychological': { fr: '21229165031', com: '18574631011', 'co.uk': '19378409031' },
  'thriller/domestic': { fr: '21229163031', com: '18574624011', 'co.uk': '19378402031' },
  'thriller/historical': { fr: '21229168031', com: '18574627011', 'co.uk': '19378405031' },

  // Mystery sub-genres
  'mystery/amateur-sleuth': { fr: '21229145031', com: '18574607011', 'co.uk': '19378383031' },
  'mystery/cozy': { fr: '21229150031', com: '18574609011', 'co.uk': '19378385031' },
  'mystery/detective': { fr: '21229148031', com: '18574618011', 'co.uk': '19378394031' },
  'mystery/hard-boiled': { fr: '21229153031', com: '18574614011' },
  'mystery/historical': { fr: '21229155031', com: '18574615011', 'co.uk': '19378391031' },
  'mystery/noir': { fr: '21229177031', com: '18574602011' },
  'mystery/police-procedural': { fr: '21229144031', com: '18574617011', 'co.uk': '19378393031' },
  'mystery/private-investigator': { fr: '21229148031', com: '18574618011', 'co.uk': '19378394031' },
  'mystery/traditional': { fr: '21229152031', com: '18574619011', 'co.uk': '19378397031' },

  // Romance sub-genres
  'romance/action-adventure': { fr: '21229096031', com: '18580519011', 'co.uk': '19378420031' },
  'romance/comedy': { fr: '21229087031', com: '18580535011', 'co.uk': '19378436031' },
  'romance/contemporary': { fr: '21230152031', com: '18580522011', 'co.uk': '19378423031' },
  'romance/fantasy': { fr: '21229095031', com: '18580523011', 'co.uk': '19378424031' },
  'romance/historical': { fr: '21229093031', com: '18580524011', 'co.uk': '19378425031' },
  'romance/paranormal': { fr: '21229088031', com: '18580534011', 'co.uk': '19378435031' },
  'romance/science-fiction': { fr: '21229085031', com: '18580537011', 'co.uk': '19378439031' },
  'romance/sports': { fr: '21229086031', com: '18580538011', 'co.uk': '19378440031' },
  'romance/suspense': { fr: '21229090031', com: '18580536011', 'co.uk': '19378437031' },

  // Literary Fiction sub-genres
  'literary-fiction/action-adventure': {
    fr: '21229016031',
    com: '18574427011',
    'co.uk': '19378254031',
  },
  'literary-fiction/classics': { fr: '21229007031', com: '18574449011', 'co.uk': '19378271031' },
  'literary-fiction/coming-of-age': {
    fr: '21229655031',
    com: '18574461011',
    'co.uk': '19378294031',
  },
  'literary-fiction/contemporary': {
    fr: '21229657031',
    com: '18574462011',
    'co.uk': '19378295031',
  },
  'literary-fiction/drama': { fr: '21229017031', com: '18574450011', 'co.uk': '19378272031' },
  'literary-fiction/family-life': { fr: '21229670031', com: '18574465011', 'co.uk': '19378298031' },
  'literary-fiction/fiction': { fr: '21229019031', com: '18574456011', 'co.uk': '19378276031' },
  'literary-fiction/historical': { fr: '21229010031', com: '18574482011', 'co.uk': '19378316031' },
  'literary-fiction/sagas': { fr: '21229654031', com: '18574476011' },
  'literary-fiction/sea-adventures': {
    fr: '21229673031',
    com: '18574434011',
    'co.uk': '19378310031',
  },
  'literary-fiction/world-literature': {
    fr: '21229018031',
    com: '18574521011',
    'co.uk': '19378348031',
  },

  // Biography sub-genres
  'biography/entertainment': { fr: '21228985031', com: '18571984011', 'co.uk': '19393920031' },

  // History sub-genres
  'history/europe': { fr: '21229067031', com: '18573582011', 'co.uk': '19394301031' },

  // Children sub-genres
  'children/action-adventure': { fr: '21228913031', com: '18572092011', 'co.uk': '19376663031' },
  'children/mystery': { fr: '21228927031', com: '18572548011', 'co.uk': '19377096031' },
  'children/science-fiction-fantasy': {
    fr: '21228926031',
    com: '18572586011',
    'co.uk': '19377132031',
  },
  'children/fantasy': { fr: '21229338031', com: '18572587011' },
  'children/science-fiction': { fr: '21229339031', com: '18572593011' },

  // Young Adult sub-genres
  'young-adult/literary-fiction': { fr: '21229110031', com: '18580894011', 'co.uk': '19377728031' },
  'young-adult/romance': { fr: '21229117031', com: '18581004011', 'co.uk': '19377836031' },
  'young-adult/science-fiction-fantasy': {
    fr: '21229103031',
    com: '18581048011',
    'co.uk': '19377879031',
  },
  'young-adult/fantasy': { fr: '21230013031', com: '18581049011' },
  'young-adult/science-fiction': { fr: '21230014031', com: '18581062011' },
  'young-adult/thriller': { fr: '21229114031', com: '18580961011', 'co.uk': '19377808031' },
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
