import { audibleFetch, fetchAllPages } from './fetch.js'
import type { AudibleCredentials } from './types.js'

const RESPONSE_GROUPS = 'product_details,contributors,media,product_attrs,listening_status,series'

/**
 * Fetch the user's entire Audible library with automatic pagination.
 *
 * @returns All library items and the (potentially refreshed) credentials
 */
export const fetchLibrary = async (credentials: AudibleCredentials) =>
  fetchAllPages('/library', credentials, RESPONSE_GROUPS)

/**
 * Fetch the user's entire Audible wishlist with automatic pagination.
 *
 * @returns All wishlist items and the (potentially refreshed) credentials
 */
export const fetchWishlist = async (credentials: AudibleCredentials) =>
  fetchAllPages('/wishlist', credentials, RESPONSE_GROUPS)

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
