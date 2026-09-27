import { describe, expect, setDefaultTimeout, test } from 'bun:test'
import { product, search } from './catalog'
import { loadCredentials } from './credentials'

setDefaultTimeout(60_000)

describe('search integration', () => {
  test('finds a title by title and author without a category', async () => {
    const { items } = await search(loadCredentials(), {
      title: 'Dune',
      author: 'Frank Herbert',
      limit: 5,
    })

    expect(items.length).toBeGreaterThan(0)
    expect(items.length).toBeLessThanOrEqual(5)
    expect(items.some((item) => item.authors.includes('Frank Herbert'))).toBe(true)
  })

  test('returns the most relevant results, the first page of them', async () => {
    const credentials = loadCredentials()
    const [{ items: first }, { items: page }] = await Promise.all([
      search(credentials, { keywords: 'Dune Frank Herbert', limit: 1 }),
      search(credentials, { keywords: 'Dune Frank Herbert', limit: 10 }),
    ])

    expect(first).toHaveLength(1)
    expect(page[0]?.asin).toBe(first[0].asin)
  })

  test('refuses a search with nothing to search for', async () => {
    expect(search(loadCredentials(), {})).rejects.toThrow()
  })
})

describe('product integration', () => {
  test('looks a title up by the ASIN a search found', async () => {
    const credentials = loadCredentials()
    const { items } = await search(credentials, { keywords: 'Dune Frank Herbert', limit: 1 })
    const { item } = await product(credentials, items[0].asin)

    expect(item?.asin).toBe(items[0].asin)
    expect(item?.title).toBe(items[0].title)
    expect(item?.authors.length).toBeGreaterThan(0)
  })

  test('answers nothing for an ASIN the marketplace does not sell', async () => {
    const { item } = await product(loadCredentials(), 'B000000000')
    expect(item).toBeUndefined()
  })
})
