import { orderBy, uniqBy } from 'lodash-es'
import { resolveGenreId } from './categories.js'
import { audibleFetch, toAudibleItem } from './fetch.js'
import { audibleRawItemSchema } from './schemas.js'
import type { AudibleCredentials, AudibleItem, CatalogOptions, SearchOptions } from './types.js'

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

  const sortBy = options.sortBy ?? 'Relevance'
  const limit = options.limit ?? 50

  if (sortBy === 'MostVoted') {
    const MAX_PAGES = 20
    const { items: allItems, credentials: fresh } = await fetchCatalogPages(
      credentials,
      categoryId,
      options,
      MAX_PAGES,
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
      num_results: String(limit === 'all' ? PAGE_SIZE : Math.min(limit, PAGE_SIZE)),
      page: '1',
      response_groups: CATALOG_RESPONSE_GROUPS,
      ...(options.keywords ? { keywords: options.keywords } : {}),
      ...(options.author ? { author: options.author } : {}),
      ...(options.narrator ? { narrator: options.narrator } : {}),
    },
  )

  return { items: parseResponse(response), credentials: fresh }
}

/**
 * Search the whole Audible catalog of the account's marketplace, without a
 * category: by title, author, narrator or free keywords, most relevant first.
 * Credentials are auto-refreshed if expired.
 *
 * `limit` controls how many items to return (default 10, at most 50).
 *
 * @returns The matching catalog items and the credentials
 */
export const search = async (credentials: AudibleCredentials, options: SearchOptions) => {
  if (!options.keywords && !options.title && !options.author && !options.narrator) {
    throw new Error('At least one of "keywords", "title", "author" or "narrator" must be provided')
  }

  const { data: response, credentials: fresh } = await audibleFetch<Record<string, unknown>>(
    '/catalog/products',
    credentials,
    {
      products_sort_by: 'Relevance',
      num_results: String(Math.min(options.limit ?? 10, PAGE_SIZE)),
      page: '1',
      response_groups: CATALOG_RESPONSE_GROUPS,
      ...(options.keywords ? { keywords: options.keywords } : {}),
      ...(options.title ? { title: options.title } : {}),
      ...(options.author ? { author: options.author } : {}),
      ...(options.narrator ? { narrator: options.narrator } : {}),
    },
  )

  return { items: parseResponse(response), credentials: fresh }
}

/**
 * Look one audiobook up by its ASIN in the account's marketplace, whether or not
 * the account owns it. Credentials are auto-refreshed if expired.
 *
 * Audible answers an ASIN it does not sell there with an empty product rather
 * than an error: `item` is then undefined.
 *
 * @returns The catalog item, if any, and the credentials
 */
export const product = async (credentials: AudibleCredentials, asin: string) => {
  const { data: response, credentials: fresh } = await audibleFetch<{ product?: unknown }>(
    `/catalog/products/${encodeURIComponent(asin)}`,
    credentials,
    { response_groups: CATALOG_RESPONSE_GROUPS },
  )

  const parsed = audibleRawItemSchema.safeParse(response.product)
  return { item: parsed.success ? toAudibleItem(parsed.data) : undefined, credentials: fresh }
}
