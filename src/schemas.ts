import { z } from 'zod'

/** Zod schema for parsing raw Audible API item responses */
export const audibleRawItemSchema = z.object({
  asin: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.object({ name: z.string() })).default([]),
  narrators: z.array(z.object({ name: z.string() })).default([]),
  runtime_length_min: z.number().nonnegative().default(0),
  publisher_name: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  language: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  release_date: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  product_images: z
    .record(z.string(), z.string())
    .nullish()
    .transform((v) => v ?? undefined),
  series: z
    .array(
      z.object({
        asin: z.string(),
        title: z.string(),
        sequence: z
          .string()
          .nullish()
          .transform((v) => v ?? undefined),
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
  listening_status: z
    .object({
      is_finished: z.boolean().optional(),
      percent_complete: z.number().optional(),
      finished_at_timestamp: z.string().nullish(),
    })
    .nullish()
    .transform((v) => v ?? undefined),
})

/** Zod schema for parsing Audible rating data */
export const audibleRatingSchema = z
  .object({
    num_reviews: z.number().default(0),
    overall_distribution: z
      .object({
        average_rating: z.number(),
        num_ratings: z.number(),
      })
      .nullish(),
  })
  .nullish()

/** Extended schema for catalog items (includes rating) */
export const audibleCatalogItemSchema = audibleRawItemSchema.extend({
  rating: audibleRatingSchema,
})
