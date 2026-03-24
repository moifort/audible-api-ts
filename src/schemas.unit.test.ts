import { describe, expect, test } from 'bun:test'
import { audibleRawItemSchema } from './schemas'

describe('audibleRawItemSchema', () => {
  test('parses a minimal item', () => {
    const result = audibleRawItemSchema.parse({
      asin: 'B08G9PRS1K',
      title: 'Test Audiobook',
    })

    expect(result.asin).toBe('B08G9PRS1K')
    expect(result.title).toBe('Test Audiobook')
    expect(result.authors).toEqual([])
    expect(result.narrators).toEqual([])
    expect(result.runtime_length_min).toBe(0)
    expect(result.publisher_name).toBeUndefined()
    expect(result.language).toBeUndefined()
    expect(result.series).toEqual([])
    expect(result.listening_status).toBeUndefined()
  })

  test('parses a full item', () => {
    const result = audibleRawItemSchema.parse({
      asin: 'B08G9PRS1K',
      title: 'Dune',
      authors: [{ name: 'Frank Herbert' }],
      narrators: [{ name: 'Scott Brick' }, { name: 'Orlagh Cassidy' }],
      runtime_length_min: 1260,
      publisher_name: 'Macmillan Audio',
      language: 'english',
      release_date: '2020-09-01',
      product_images: { '500': 'https://example.com/cover-500.jpg' },
      series: [{ asin: 'B09FRLGZ1M', title: 'Dune', sequence: '1' }],
      listening_status: {
        is_finished: true,
        percent_complete: 100,
        finished_at_timestamp: '2024-01-15T10:30:00Z',
      },
    })

    expect(result.authors).toEqual([{ name: 'Frank Herbert' }])
    expect(result.narrators).toHaveLength(2)
    expect(result.runtime_length_min).toBe(1260)
    expect(result.publisher_name).toBe('Macmillan Audio')
    expect(result.series).toEqual([{ asin: 'B09FRLGZ1M', title: 'Dune', sequence: '1' }])
    expect(result.listening_status?.finished_at_timestamp).toBe('2024-01-15T10:30:00Z')
  })

  test('transforms null optional fields to undefined', () => {
    const result = audibleRawItemSchema.parse({
      asin: 'B08G9PRS1K',
      title: 'Test',
      publisher_name: null,
      language: null,
      release_date: null,
      product_images: null,
      series: null,
      listening_status: null,
    })

    expect(result.publisher_name).toBeUndefined()
    expect(result.language).toBeUndefined()
    expect(result.release_date).toBeUndefined()
    expect(result.product_images).toEqual({})
    expect(result.series).toEqual([])
    expect(result.listening_status).toBeUndefined()
  })

  test('rejects missing asin', () => {
    expect(() => audibleRawItemSchema.parse({ title: 'Test' })).toThrow()
  })

  test('rejects empty asin', () => {
    expect(() => audibleRawItemSchema.parse({ asin: '', title: 'Test' })).toThrow()
  })
})
