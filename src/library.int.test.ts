import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { loadCredentials } from './credentials'
import { library, wishlist } from './library'

setDefaultTimeout(30_000)

describe('library integration', () => {
  test('library returns items with correct types on first item', async () => {
    const { items } = await library(loadCredentials())

    expect(items.length).toBeGreaterThan(0)

    const first = items[0]
    expect(first.asin).toBeTruthy()
    expect(first.title).toBeTruthy()
    expect(first.authors.length).toBeGreaterThan(0)
    expect(first.narrators.length).toBeGreaterThan(0)
    expect(first.durationMinutes).toBeGreaterThan(0)
    expect(typeof first.isAdultProduct).toBe('boolean')
    expect(first.categories).toBeInstanceOf(Array)
    expect(first.relationships).toBeInstanceOf(Array)
    expect(first.productImages).toBeDefined()
    if (first.releaseDate) expect(first.releaseDate).toBeInstanceOf(Date)
    if (first.listeningStatus?.finishedAt) {
      expect(first.listeningStatus.finishedAt).toBeInstanceOf(Date)
    }
  })

  test('wishlist returns an array with valid first item', async () => {
    const { items } = await wishlist(loadCredentials())

    expect(items).toBeInstanceOf(Array)
    if (items.length > 0) {
      expect(items[0].asin).toBeTruthy()
      expect(items[0].title).toBeTruthy()
    }
  })
})
