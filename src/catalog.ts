import { orderBy } from 'lodash-es'
import { audibleFetch, toAudibleItem } from './fetch.js'
import { audibleRawItemSchema } from './schemas.js'
import type { AudibleCredentials, AudibleItem, CatalogOptions } from './types.js'

const CATALOG_RESPONSE_GROUPS =
  'product_details,contributors,media,product_attrs,rating,category_ladders,series,product_desc,product_extended_attrs,relationships'

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

  const items: AudibleItem[] = orderBy(
    extractItems(response).map((raw) => toAudibleItem(audibleRawItemSchema.parse(raw))),
    [
      ({ rating }) => rating?.overallDistribution?.numRatings ?? 0,
      ({ rating }) => rating?.overallDistribution?.averageRating ?? 0,
    ],
    ['desc', 'desc'],
  )

  return { items, credentials }
}
