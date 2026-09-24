import { Buffer } from 'node:buffer'

export const base64url = (buffer: Buffer) =>
  buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const base64nopad = (buffer: Buffer) => buffer.toString('base64').replace(/=+$/, '')

export const toHexString = (input: string) => Buffer.from(input, 'utf-8').toString('hex')

/** The query string of a request, every key and value URL-encoded: a keyword
 *  or an author name with a space or an accent would otherwise make an invalid
 *  URL, whose signature Audible refuses with a 403. */
export const toQueryString = (query: Record<string, string>) =>
  Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
