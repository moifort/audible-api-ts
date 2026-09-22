import { chunk } from 'lodash-es'
import { audibleFetch, fetchAllPages } from './fetch.js'
import { lastPositionsSchema } from './schemas.js'
import type { AudibleCredentials, LastPosition } from './types.js'

const RESPONSE_GROUPS =
  'product_details,contributors,media,product_attrs,listening_status,series,rating,category_ladders,product_desc,product_extended_attrs,relationships'

/**
 * Fetch the user's entire Audible library with automatic pagination.
 * Credentials are auto-refreshed if expired.
 *
 * @returns All library items and the (potentially refreshed) credentials
 */
export const library = async (credentials: AudibleCredentials) =>
  fetchAllPages('/library', credentials, RESPONSE_GROUPS)

/**
 * Fetch the user's entire Audible wishlist with automatic pagination.
 * Credentials are auto-refreshed if expired.
 *
 * @returns All wishlist items and the (potentially refreshed) credentials
 */
export const wishlist = async (credentials: AudibleCredentials) =>
  fetchAllPages('/wishlist', credentials, RESPONSE_GROUPS)

/** Audible answers a 400 to more ASINs than this in one call. */
const POSITIONS_BATCH_SIZE = 25

/** Audible dates a position as `2026-09-16 20:55:15.357`, no zone, in UTC. */
const utcDateOf = (value: string) => new Date(`${value.replace(' ', 'T')}Z`)

const fetchPositionBatches = async (
  batches: string[][],
  credentials: AudibleCredentials,
  accumulated: LastPosition[] = [],
): Promise<{ positions: LastPosition[]; credentials: AudibleCredentials }> => {
  const [batch, ...rest] = batches
  if (!batch) return { positions: accumulated, credentials }

  const { data, credentials: fresh } = await audibleFetch<unknown>(
    '/annotations/lastpositions',
    credentials,
    { asins: batch.join(',') },
  )
  const heard = lastPositionsSchema
    .parse(data)
    .asin_last_position_heard_annots.flatMap(({ asin, last_position_heard: position }) =>
      position.status === 'Exists' && position.last_updated
        ? [
            {
              asin,
              positionMs: position.position_ms ?? 0,
              lastUpdatedAt: utcDateOf(position.last_updated),
            },
          ]
        : [],
    )

  return fetchPositionBatches(rest, fresh, [...accumulated, ...heard])
}

/**
 * Fetch where the reader last stopped in each of the given titles.
 * Asked in batches of 25, the most Audible accepts per call. A title the
 * reader never opened is left out of the answer.
 * Credentials are auto-refreshed if expired.
 *
 * @returns The last positions and the (potentially refreshed) credentials
 */
export const lastPositions = async (credentials: AudibleCredentials, asins: readonly string[]) =>
  fetchPositionBatches(chunk([...asins], POSITIONS_BATCH_SIZE), credentials)

/**
 * Verify that credentials are valid by making a minimal API call.
 * Credentials are auto-refreshed if expired.
 *
 * @throws If credentials are invalid or expired
 */
export const verify = async (credentials: AudibleCredentials) => {
  await audibleFetch<Record<string, unknown>>('/library', credentials, {
    num_results: '1',
    page: '1',
    response_groups: 'product_details',
  })
}
