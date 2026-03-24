import { describe, expect, setDefaultTimeout, test } from 'bun:test'

setDefaultTimeout(30_000)

import { refresh } from './client'
import { loadCredentials } from './credentials'
import { library, wishlist } from './library'

describe('library integration', () => {
  test('library returns items with required fields', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await library(fresh)

    expect(items.length).toBeGreaterThan(0)

    items.slice(0, 5).map((item) => {
      expect(item.asin).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.authors.length).toBeGreaterThan(0)
      expect(item.narrators.length).toBeGreaterThan(0)
      expect(item.durationMinutes).toBeGreaterThan(0)
      expect(typeof item.isAdultProduct).toBe('boolean')
      expect(item.categories).toBeInstanceOf(Array)
      expect(item.relationships).toBeInstanceOf(Array)
      expect(item.productImages).toBeDefined()
    })
  })

  test('library items have correct date types', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await library(fresh)

    const withRelease = items.filter((item) => item.releaseDate)
    expect(withRelease.length).toBeGreaterThan(0)
    withRelease.slice(0, 3).map((item) => expect(item.releaseDate).toBeInstanceOf(Date))

    const withFinished = items.filter((item) => item.listeningStatus?.finishedAt)
    withFinished
      .slice(0, 3)
      .map((item) => expect(item.listeningStatus?.finishedAt).toBeInstanceOf(Date))
  })

  test('wishlist returns an array', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await wishlist(fresh)

    expect(items).toBeInstanceOf(Array)
    items.slice(0, 3).map((item) => {
      expect(item.asin).toBeTruthy()
      expect(item.title).toBeTruthy()
    })
  })
})
