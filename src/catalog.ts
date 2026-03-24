import { orderBy, uniqBy } from 'lodash-es'
import { resolveGenreId } from './categories.js'
import { audibleFetch, toAudibleItem } from './fetch.js'
import { audibleRawItemSchema } from './schemas.js'
import type { AudibleCredentials, AudibleItem, CatalogOptions } from './types.js'

const CATALOG_RESPONSE_GROUPS =
  'product_details,contributors,media,product_attrs,rating,category_ladders,series,product_desc,product_extended_attrs,relationships'

const PAGE_SIZE = 50

const extractItems = (response: Record<string, unknown>): unknown[] =>
  Array.isArray(response.products)
    ? response.products
    : Array.isArray(response.items)
      ? response.items
      : []

const parseResponse = (response: Record<string, unknown>): AudibleItem[] =>
  extractItems(response).map((raw) => toAudibleItem(audibleRawItemSchema.parse(raw)))

const fetchCatalogPages = async (
  credentials: AudibleCredentials,
  categoryId: string,
  options: CatalogOptions,
  maxPages: number,
  accumulated: AudibleItem[] = [],
  page = 1,
): Promise<{ items: AudibleItem[]; credentials: AudibleCredentials }> => {
  const { data: response, credentials: fresh } = await audibleFetch<Record<string, unknown>>(
    '/catalog/products',
    credentials,
    {
      category_id: categoryId,
      products_sort_by: 'Relevance',
      num_results: String(PAGE_SIZE),
      page: String(page),
      response_groups: CATALOG_RESPONSE_GROUPS,
      ...(options.keywords ? { keywords: options.keywords } : {}),
      ...(options.author ? { author: options.author } : {}),
      ...(options.narrator ? { narrator: options.narrator } : {}),
    },
  )

  const rawItems = extractItems(response)
  const items = [...accumulated, ...parseResponse(response)]

  return rawItems.length < PAGE_SIZE || page >= maxPages
    ? { items, credentials: fresh }
    : fetchCatalogPages(fresh, categoryId, options, maxPages, items, page + 1)
}

/**
 * Search the Audible catalog by category with optional filters.
 * Credentials are auto-refreshed if expired.
 *
 * - `sortBy: 'MostVoted'` (default) — fetches pages, sorts by votes desc then rating desc.
 * - Any other `sortBy` — single-page fetch using the Audible API sort order.
 *
 * `limit` controls how many items to return (default 50, `'all'` for everything).
 *
 * @returns Catalog items sorted by the chosen criteria and the credentials
 */
export const catalog = async (credentials: AudibleCredentials, options: CatalogOptions) => {
  const categoryId = options.category
    ? resolveGenreId(options.category, credentials.locale)
    : options.categoryId

  if (!categoryId) {
    throw new Error('Either "category" or "categoryId" must be provided')
  }

  const sortBy = options.sortBy ?? 'MostVoted'
  const limit = options.limit ?? 50

  if (sortBy === 'MostVoted') {
    const MAX_PAGES = 20
    const maxPages = limit === 'all' ? MAX_PAGES : Math.ceil(limit / PAGE_SIZE)
    const { items: allItems, credentials: fresh } = await fetchCatalogPages(
      credentials,
      categoryId,
      options,
      maxPages,
    )

    const sorted = orderBy(
      uniqBy(allItems, ({ asin }) => asin),
      [
        ({ rating }) => rating?.overallDistribution?.numRatings ?? 0,
        ({ rating }) => rating?.overallDistribution?.averageRating ?? 0,
      ],
      ['desc', 'desc'],
    )

    return {
      items: limit === 'all' ? sorted : sorted.slice(0, limit),
      credentials: fresh,
    }
  }

  const { data: response, credentials: fresh } = await audibleFetch<Record<string, unknown>>(
    '/catalog/products',
    credentials,
    {
      category_id: categoryId,
      products_sort_by: sortBy,
      num_results: String(limit === 'all' ? PAGE_SIZE : limit),
      page: '1',
      response_groups: CATALOG_RESPONSE_GROUPS,
      ...(options.keywords ? { keywords: options.keywords } : {}),
      ...(options.author ? { author: options.author } : {}),
      ...(options.narrator ? { narrator: options.narrator } : {}),
    },
  )

  return { items: parseResponse(response), credentials: fresh }
}
