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

const DEFAULT_MAX_PAGES = 10

const fetchAllCatalogPages = async (
  credentials: AudibleCredentials,
  categoryId: string,
  options: CatalogOptions,
  maxPages: number,
  accumulated: AudibleItem[] = [],
  page = 1,
): Promise<AudibleItem[]> => {
  const query: Record<string, string> = {
    category_id: categoryId,
    products_sort_by: 'Relevance',
    num_results: String(PAGE_SIZE),
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

  const rawItems = extractItems(response)
  const items = [...accumulated, ...parseResponse(response)]

  return rawItems.length < PAGE_SIZE || page >= maxPages
    ? items
    : fetchAllCatalogPages(credentials, categoryId, options, maxPages, items, page + 1)
}

/**
 * Search the Audible catalog by category with optional filters.
 *
 * - `sortBy: 'MostVoted'` (default) — fetches ALL pages of the category,
 *   then sorts by number of ratings (desc) and average rating (desc).
 * - Any other `sortBy` — single-page fetch using the Audible API sort order.
 *
 * @returns Catalog items sorted by the chosen criteria and the credentials
 */
export const fetchCatalog = async (credentials: AudibleCredentials, options: CatalogOptions) => {
  const categoryId = options.category
    ? resolveGenreId(options.category, credentials.locale)
    : options.categoryId

  if (!categoryId) {
    throw new Error('Either "category" or "categoryId" must be provided')
  }

  const sortBy = options.sortBy ?? 'MostVoted'
  const numResults = options.numResults ?? 50

  // MostVoted: fetch all pages, sort client-side by votes
  if (sortBy === 'MostVoted') {
    const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES
    const allItems = await fetchAllCatalogPages(credentials, categoryId, options, maxPages)

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

  // Standard API sort: single page
  const query: Record<string, string> = {
    category_id: categoryId,
    products_sort_by: sortBy,
    num_results: String(numResults),
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

  return { items: parseResponse(response).slice(0, numResults), credentials }
}
