import { AUDIBLE_LOCALES } from './locales.js'
import { audibleRawItemSchema } from './schemas.js'
import { signRequest } from './signing.js'
import type { AudibleCredentials, AudibleItem } from './types.js'

const RESPONSE_GROUPS = 'product_details,contributors,media,product_attrs,listening_status'

const audibleFetch = async <T>(
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

  const url = new URL(`https://api.audible.${config.domain}${fullPath}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      url.searchParams.set(k, v)
    }
  }

  const response = await fetch(url.toString(), { headers })

  if (!response.ok) {
    throw new Error(`Audible API error: ${response.status} ${response.statusText} (${path})`)
  }

  return (await response.json()) as T
}

const parseItems = (items: unknown[]): AudibleItem[] =>
  items.map((raw) => {
    const item = audibleRawItemSchema.parse(raw)
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
      finishedAt: item.listening_status?.finished_at_timestamp
        ? new Date(item.listening_status.finished_at_timestamp)
        : undefined,
    }
  })

const extractItems = (response: Record<string, unknown>): unknown[] => {
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.products)) return response.products
  return []
}

const fetchPaginated = async (path: string, credentials: AudibleCredentials) => {
  const allItems: AudibleItem[] = []
  const pageSize = 50
  let page = 1

  while (true) {
    const response = await audibleFetch<Record<string, unknown>>(path, credentials, {
      response_groups: RESPONSE_GROUPS,
      num_results: String(pageSize),
      page: String(page),
    })

    const rawItems = extractItems(response)
    allItems.push(...parseItems(rawItems))

    if (rawItems.length < pageSize) break
    page += 1
  }

  return { items: allItems, credentials }
}

/**
 * Fetch the user's entire Audible library with automatic pagination.
 *
 * @returns All library items and the (potentially refreshed) credentials
 */
export const fetchLibrary = async (credentials: AudibleCredentials) =>
  fetchPaginated('/library', credentials)

/**
 * Fetch the user's entire Audible wishlist with automatic pagination.
 *
 * @returns All wishlist items and the (potentially refreshed) credentials
 */
export const fetchWishlist = async (credentials: AudibleCredentials) =>
  fetchPaginated('/wishlist', credentials)

/**
 * Verify that credentials are valid by making a minimal API call.
 *
 * @throws If credentials are invalid or expired
 */
export const verifyConnection = async (credentials: AudibleCredentials) => {
  await audibleFetch<Record<string, unknown>>('/library', credentials, {
    num_results: '1',
    page: '1',
    response_groups: 'product_details',
  })
}
