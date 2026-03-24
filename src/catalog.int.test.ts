import { describe, expect, setDefaultTimeout, test } from 'bun:test'

setDefaultTimeout(30_000)

import { catalog } from './catalog'
import { refresh } from './client'
import { loadCredentials } from './credentials'

describe('catalog integration', () => {
  test('catalog with genre returns items with ratings', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await catalog(fresh, {
      category: 'science-fiction',
      sortBy: 'BestSellers',
      numResults: 10,
    })

    expect(items.length).toBeGreaterThan(0)

    items.map((item) => {
      expect(item.asin).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.rating).toBeDefined()
      expect(item.rating?.overallDistribution).toBeDefined()
      expect(item.rating?.overallDistribution?.numRatings).toBeGreaterThanOrEqual(0)
      expect(item.rating?.overallDistribution?.averageRating).toBeGreaterThanOrEqual(0)
    })
  })

  test('MostVoted returns items sorted by votes descending', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await catalog(fresh, {
      category: 'science-fiction',
      sortBy: 'MostVoted',
      maxPages: 2,
      numResults: 20,
    })

    expect(items.length).toBe(20)

    // Verify descending order by numRatings
    items.reduce((prevVotes, item) => {
      const votes = item.rating?.overallDistribution?.numRatings ?? 0
      expect(votes).toBeLessThanOrEqual(prevVotes)
      return votes
    }, Number.POSITIVE_INFINITY)
  })

  test('catalog with keywords filters results', async () => {
    const fresh = await refresh(loadCredentials())
    const { items } = await catalog(fresh, {
      category: 'science-fiction',
      sortBy: 'Relevance',
      keywords: 'dune',
      numResults: 5,
    })

    expect(items.length).toBeGreaterThan(0)
  })
})
