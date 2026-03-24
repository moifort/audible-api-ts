import { orderBy, uniqBy } from 'lodash-es'
import { resolveGenreId } from './categories.js'
import { audibleFetch, toAudibleItem } from './fetch.js'
import { audibleRawItemSchema } from './schemas.js'
import type { AudibleCredentials, AudibleItem, CatalogOptions } from './types.js'

const CATALOG_RESPONSE_GROUPS =
  'product_details,contributors,media,product_attrs,rating,category_ladders,series,product_desc,product_extended_attrs,relationships'

const MULTI_PAGE_SORTS = ['BestSellers', 'AvgRating', 'Relevance'] as const

const extractItems = (response: Record<string, unknown>): unknown[] =>
  Array.isArray(response.products)
    ? response.products
    : Array.isArray(response.items)
      ? response.items
      : []

const fetchOnePage = async (
  credentials: AudibleCredentials,
  categoryId: string,
  sortBy: string,
  numResults: number,
  page: number,
  options: CatalogOptions,
) => {
  const query: Record<string, string> = {
    category_id: categoryId,
    products_sort_by: sortBy,
    num_results: String(numResults),
    page: String(page),
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

  return extractItems(response).map((raw) => toAudibleItem(audibleRawItemSchema.parse(raw)))
}

/**
 * Search the Audible catalog by category with optional filters.
 *
 * Use `category` (genre name) or `categoryId` (raw Audible ID).
 * When `pages > 1`, fetches multiple pages across different sort orders
 * to maximize coverage, then sorts by number of ratings (desc) and average rating (desc).
 *
 * @returns Catalog items sorted by popularity and the credentials
 */
export const fetchCatalog = async (credentials: AudibleCredentials, options: CatalogOptions) => {
  const categoryId = options.category
    ? resolveGenreId(options.category, credentials.locale)
    : options.categoryId

  if (!categoryId) {
    throw new Error('Either "category" or "categoryId" must be provided')
  }

  const numResults = options.numResults ?? 50
  const pageCount = Math.min(options.pages ?? 1, 5)

  const allItems: AudibleItem[] =
    pageCount <= 1
      ? await fetchOnePage(
          credentials,
          categoryId,
          options.sortBy ?? 'Relevance',
          numResults,
          options.page ?? 1,
          options,
        )
      : (
          await Promise.all(
            MULTI_PAGE_SORTS.flatMap((sort) =>
              Array.from({ length: pageCount }, (_, i) =>
                fetchOnePage(credentials, categoryId, sort, 50, i + 1, options),
              ),
            ),
          )
        ).flat()

  const sorted = orderBy(
    uniqBy(allItems, ({ asin }) => asin),
    [
      ({ rating }) => rating?.overallDistribution?.numRatings ?? 0,
      ({ rating }) => rating?.overallDistribution?.averageRating ?? 0,
    ],
    ['desc', 'desc'],
  )

  return { items: sorted.slice(0, numResults), credentials }
}
