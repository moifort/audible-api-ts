/** Supported Audible marketplace locales */
export type AudibleLocale =
  | 'fr'
  | 'com'
  | 'co.uk'
  | 'de'
  | 'it'
  | 'es'
  | 'ca'
  | 'com.au'
  | 'in'
  | 'co.jp'

/** Marketplace configuration for a given locale */
export type LocaleConfig = {
  domain: string
  marketplaceId: string
  countryCode: string
}

/** Credentials obtained after device registration */
export type AudibleCredentials = {
  accessToken: string
  refreshToken: string
  adpToken: string
  devicePrivateKey: string
  serial: string
  locale: AudibleLocale
  expiresAt: Date
}

/** Rating distribution for a single dimension (overall, performance, or story) */
export type RatingDistribution = {
  averageRating: number
  displayAverageRating: string
  displayStars: number
  numRatings: number
  numFiveStarRatings: number
  numFourStarRatings: number
  numThreeStarRatings: number
  numTwoStarRatings: number
  numOneStarRatings: number
}

/** Full rating data for an audiobook */
export type AudibleRating = {
  numReviews: number
  overallDistribution?: RatingDistribution
  performanceDistribution?: RatingDistribution
  storyDistribution?: RatingDistribution
}

/** A category in the Audible taxonomy */
export type AudibleCategory = {
  id: string
  name: string
}

/** A category path from root to leaf */
export type CategoryLadder = {
  root: string
  categories: AudibleCategory[]
}

/** A relationship to another Audible product */
export type AudibleRelationship = {
  asin: string
  relationshipToProduct: string
  relationshipType: string
  title?: string
  sort?: string
  url?: string
}

/** Listening progress for a library item */
export type ListeningStatus = {
  finishedAt?: Date
  isFinished?: boolean
  percentComplete?: number
  timeRemainingSeconds?: number
}

/** An audiobook item from Audible */
export type AudibleItem = {
  // Identity
  asin: string
  title: string
  subtitle?: string
  isbn?: string
  sku?: string

  // People
  authors: string[]
  narrators: string[]

  // Content
  durationMinutes: number
  publisher?: string
  language?: string
  releaseDate?: Date
  coverUrl?: string
  summary?: string
  description?: string
  merchandisingSummary?: string
  copyright?: string
  formatType?: string
  contentType?: string
  contentDeliveryType?: string
  programParticipation?: string

  // Classification
  series?: { name: string; position?: number }
  categories: CategoryLadder[]
  keywords: string[]

  // Ratings
  rating?: AudibleRating

  // Listening (library only)
  listeningStatus?: ListeningStatus
  purchaseDate?: Date
  dateAdded?: Date

  // Relationships
  relationships: AudibleRelationship[]

  // Flags
  isAdultProduct: boolean

  // All cover images keyed by size
  productImages: Record<string, string>

  // Social
  socialMediaImages: Record<string, string>
}

/** Options for searching the Audible catalog */
export type CatalogOptions = {
  category?: import('./categories.js').AudibleGenre
  categoryId?: string
  sortBy?:
    | 'MostVoted'
    | 'BestSellers'
    | 'AvgRating'
    | 'Relevance'
    | 'ReleaseDate'
    | '-ReleaseDate'
    | 'Title'
  keywords?: string
  author?: string
  narrator?: string
  numResults?: number
  page?: number
  maxPages?: number
}

/** PKCE auth session — returned by generateLoginUrl, passed back to registerDevice */
export type AuthSession = {
  codeVerifier: string
  serial: string
  locale: AudibleLocale
  createdAt: Date
}

/** Cookie to set in the browser before redirecting to the login URL */
export type AudibleCookie = {
  name: string
  value: string
  domain: string
}
