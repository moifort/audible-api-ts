import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { AudibleCredentials } from './types.js'

/**
 * Load Audible credentials from the AUDIBLE_CREDENTIALS env var (JSON string)
 * or from a `.credentials.json` file at the project root.
 *
 * @throws If neither source is available or the JSON is invalid
 */
export const loadCredentials = () => {
  const raw =
    process.env.AUDIBLE_CREDENTIALS ?? readFile(resolve(import.meta.dir, '..', '.credentials.json'))

  if (!raw) {
    throw new Error(
      'Credentials not found. Set AUDIBLE_CREDENTIALS env var or create .credentials.json',
    )
  }

  const parsed = JSON.parse(raw) as Record<string, unknown>
  return {
    ...parsed,
    expiresAt: new Date(parsed.expiresAt as string),
  } as AudibleCredentials
}

const readFile = (path: string) => {
  try {
    return readFileSync(path, 'utf-8')
  } catch {
    return undefined
  }
}
