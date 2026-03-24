import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { catalog } from './catalog'
import { loadCredentials } from './credentials'

setDefaultTimeout(60_000)

describe('catalog integration', () => {
  test('limit controls the number of returned items', async () => {
    const { items } = await catalog(loadCredentials(), {
      category: 'science-fiction',
      sortBy: 'BestSellers',
      limit: 5,
    })

    expect(items.length).toBe(5)
    expect(items[0].asin).toBeTruthy()
    expect(items[0].rating).toBeDefined()
    expect(items[0].rating?.overallDistribution?.numRatings).toBeGreaterThanOrEqual(0)
  })

  test('MostVoted fetches all pages and returns sorted by votes descending', async () => {
    const { items } = await catalog(loadCredentials(), {
      category: 'science-fiction',
      sortBy: 'MostVoted',
      limit: 10,
    })

    expect(items.length).toBe(10)

    items.reduce((prevVotes, item) => {
      const votes = item.rating?.overallDistribution?.numRatings ?? 0
      expect(votes).toBeLessThanOrEqual(prevVotes)
      return votes
    }, Number.POSITIVE_INFINITY)
  })
})
