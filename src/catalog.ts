import { orderBy } from 'lodash-es'
import { audibleFetch } from './fetch.js'
import { audibleCatalogItemSchema } from './schemas.js'
import type { AudibleCredentials, CatalogItem, CatalogOptions } from './types.js'

const CATALOG_RESPONSE_GROUPS =
  'product_details,contributors,media,product_attrs,rating,category_ladders,series'

const parseCatalogItems = (items: unknown[]): CatalogItem[] =>
  items.map((raw) => {
    const item = audibleCatalogItemSchema.parse(raw)
    return {
      asin: item.asin,
      title: item.title,
      authors: item.authors.map(({ name }) => name),
      narrators: item.narrators.map(({ name }) => name),
      durationMinutes: item.runtime_length_min,
      publisher: item.publisher_name,
      language: item.language,
      releaseDate: item.release_date ? new Date(item.release_date) : undefined,
      coverUrl: item.product_images?.['500'] ?? item.product_images?.['252'],
      series: item.series[0]
        ? {
            name: item.series[0].title,
            position: item.series[0].sequence ? Number(item.series[0].sequence) : undefined,
          }
        : undefined,
      rating: item.rating?.overall_distribution
        ? {
            averageRating: item.rating.overall_distribution.average_rating,
            numRatings: item.rating.overall_distribution.num_ratings,
            numReviews: item.rating.num_reviews,
          }
        : undefined,
    }
  })

const extractItems = (response: Record<string, unknown>): unknown[] =>
  Array.isArray(response.products)
    ? response.products
    : Array.isArray(response.items)
      ? response.items
      : []

/**
 * Search the Audible catalog by category with optional filters.
 *
 * Results are sorted by number of ratings (desc) then average rating (desc)
 * for maximum relevance by popularity.
 *
 * @returns Catalog items sorted by popularity and the credentials
 */
export const fetchCatalog = async (credentials: AudibleCredentials, options: CatalogOptions) => {
  const query: Record<string, string> = {
    category_id: options.categoryId,
    products_sort_by: options.sortBy ?? 'Relevance',
    num_results: String(options.numResults ?? 50),
    page: String(options.page ?? 1),
    response_groups: CATALOG_RESPONSE_GROUPS,
    ...(options.keywords ? { keywords: options.keywords } : {}),
    ...(options.author ? { author: options.author } : {}),
    ...(options.narrator ? { narrator: options.narrator } : {}),
  }

  const response = await audibleFetch<Record<string, unknown>>(
    '/catalog/products',
    credentials,
    query,
  )

  const items = orderBy(
    parseCatalogItems(extractItems(response)),
    [({ rating }) => rating?.numRatings ?? 0, ({ rating }) => rating?.averageRating ?? 0],
    ['desc', 'desc'],
  )

  return { items, credentials }
}
