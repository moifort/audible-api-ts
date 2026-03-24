import type { z } from 'zod'
import { AUDIBLE_LOCALES } from './locales.js'
import { type audibleRatingSchema, audibleRawItemSchema } from './schemas.js'
import { signRequest } from './signing.js'
import type { AudibleCredentials, AudibleItem, AudibleRating, RatingDistribution } from './types.js'

const PAGE_SIZE = 50

export const audibleFetch = async <T>(
  path: string,
  credentials: AudibleCredentials,
  query?: Record<string, string>,
) => {
  const config = AUDIBLE_LOCALES[credentials.locale]
  const fullPath = `/1.0${path}`
  const queryString = query
    ? `?${Object.entries(query)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`
    : ''
  const signPath = `${fullPath}${queryString}`

  const headers = signRequest('GET', signPath, '', credentials)

  const fetchUrl = `https://api.audible.${config.domain}${fullPath}${queryString}`

  const response = await fetch(fetchUrl, { headers })

  if (!response.ok) {
    throw new Error(`Audible API error: ${response.status} ${response.statusText} (${path})`)
  }

  return (await response.json()) as T
}

const extractItems = (response: Record<string, unknown>): unknown[] =>
  Array.isArray(response.items)
    ? response.items
    : Array.isArray(response.products)
      ? response.products
      : []

const toRatingDistribution = (
  dist: z.infer<typeof audibleRatingSchema> extends infer R
    ? R extends { overall_distribution?: infer D | null }
      ? NonNullable<D>
      : never
    : never,
): RatingDistribution => ({
  averageRating: dist.average_rating,
  displayAverageRating: dist.display_average_rating,
  displayStars: dist.display_stars,
  numRatings: dist.num_ratings,
  numFiveStarRatings: dist.num_five_star_ratings,
  numFourStarRatings: dist.num_four_star_ratings,
  numThreeStarRatings: dist.num_three_star_ratings,
  numTwoStarRatings: dist.num_two_star_ratings,
  numOneStarRatings: dist.num_one_star_ratings,
})

const toRating = (raw: z.infer<typeof audibleRatingSchema>): AudibleRating | undefined =>
  raw
    ? {
        numReviews: raw.num_reviews,
        overallDistribution: raw.overall_distribution
          ? toRatingDistribution(raw.overall_distribution)
          : undefined,
        performanceDistribution: raw.performance_distribution
          ? toRatingDistribution(raw.performance_distribution)
          : undefined,
        storyDistribution: raw.story_distribution
          ? toRatingDistribution(raw.story_distribution)
          : undefined,
      }
    : undefined

export const toAudibleItem = (item: z.infer<typeof audibleRawItemSchema>): AudibleItem => ({
  // Identity
  asin: item.asin,
  title: item.title,
  subtitle: item.subtitle,
  isbn: item.isbn,
  sku: item.sku,

  // People
  authors: item.authors.map(({ name }) => name),
  narrators: item.narrators.map(({ name }) => name),

  // Content
  durationMinutes: item.runtime_length_min,
  publisher: item.publisher_name,
  language: item.language,
  releaseDate: item.release_date ? new Date(item.release_date) : undefined,
  coverUrl: item.product_images['500'] ?? item.product_images['252'],
  summary: item.publisher_summary,
  description: item.extended_product_description,
  merchandisingSummary: item.merchandising_summary,
  copyright: item.copyright,
  formatType: item.format_type,
  contentType: item.content_type,
  contentDeliveryType: item.content_delivery_type,
  programParticipation: item.program_participation,

  // Classification
  series: item.series[0]
    ? {
        name: item.series[0].title,
        position: item.series[0].sequence ? Number(item.series[0].sequence) : undefined,
      }
    : undefined,
  categories: item.category_ladders.map((ladder) => ({
    root: ladder.root,
    categories: ladder.ladder.map(({ id, name }) => ({ id, name })),
  })),
  keywords: [...item.platinum_keywords, ...item.thesaurus_subject_keywords],

  // Rating
  rating: toRating(item.rating),

  // Listening
  listeningStatus: item.listening_status
    ? {
        finishedAt: item.listening_status.finished_at_timestamp
          ? new Date(item.listening_status.finished_at_timestamp)
          : undefined,
        isFinished: item.listening_status.is_finished,
        percentComplete: item.listening_status.percent_complete,
        timeRemainingSeconds: item.listening_status.time_remaining_seconds,
      }
    : undefined,
  purchaseDate: item.purchase_date ? new Date(item.purchase_date) : undefined,
  dateAdded: item.library_status?.date_added ? new Date(item.library_status.date_added) : undefined,

  // Relationships
  relationships: item.relationships.map((rel) => ({
    asin: rel.asin,
    relationshipToProduct: rel.relationship_to_product ?? '',
    relationshipType: rel.relationship_type ?? '',
    title: rel.title,
    sort: rel.sort,
    url: rel.url,
  })),

  // Flags
  isAdultProduct: item.is_adult_product,

  // Images
  productImages: item.product_images,
  socialMediaImages: item.social_media_images,
})

export const parseItems = (items: unknown[]): AudibleItem[] =>
  items.map((raw) => toAudibleItem(audibleRawItemSchema.parse(raw)))

export const fetchAllPages = async (
  path: string,
  credentials: AudibleCredentials,
  responseGroups: string,
  accumulated: AudibleItem[] = [],
  page = 1,
): Promise<{ items: AudibleItem[]; credentials: AudibleCredentials }> => {
  const response = await audibleFetch<Record<string, unknown>>(path, credentials, {
    response_groups: responseGroups,
    num_results: String(PAGE_SIZE),
    page: String(page),
  })

  const rawItems = extractItems(response)
  const items = [...accumulated, ...parseItems(rawItems)]

  return rawItems.length < PAGE_SIZE
    ? { items, credentials }
    : fetchAllPages(path, credentials, responseGroups, items, page + 1)
}
