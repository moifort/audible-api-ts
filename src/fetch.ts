import { AUDIBLE_LOCALES } from './locales.js'
import { audibleRawItemSchema } from './schemas.js'
import { signRequest } from './signing.js'
import type { AudibleCredentials, AudibleItem } from './types.js'

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

export const parseItems = (items: unknown[]): AudibleItem[] =>
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
