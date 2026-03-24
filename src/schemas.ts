import { z } from 'zod'

const nullToUndefined = <T>(v: T | null | undefined): T | undefined => v ?? undefined

const optionalString = z.string().nullish().transform(nullToUndefined)

const ratingDistributionSchema = z.object({
  average_rating: z.number(),
  display_average_rating: z.string().default('0'),
  display_stars: z.number().default(0),
  num_ratings: z.number(),
  num_five_star_ratings: z.number().default(0),
  num_four_star_ratings: z.number().default(0),
  num_three_star_ratings: z.number().default(0),
  num_two_star_ratings: z.number().default(0),
  num_one_star_ratings: z.number().default(0),
})

export const audibleRatingSchema = z
  .object({
    num_reviews: z.number().default(0),
    overall_distribution: ratingDistributionSchema.nullish(),
    performance_distribution: ratingDistributionSchema.nullish(),
    story_distribution: ratingDistributionSchema.nullish(),
  })
  .nullish()

const categoryLadderSchema = z.object({
  root: z.string().default('Genres'),
  ladder: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .default([]),
})

const relationshipSchema = z.object({
  asin: z.string(),
  relationship_to_product: optionalString,
  relationship_type: optionalString,
  title: optionalString,
  sort: optionalString,
  url: optionalString,
})

/** Zod schema for parsing raw Audible API item responses */
export const audibleRawItemSchema = z.object({
  // Identity
  asin: z.string().min(1),
  title: z.string().min(1),
  subtitle: optionalString,
  isbn: optionalString,
  sku: optionalString,

  // People
  authors: z.array(z.object({ name: z.string() })).default([]),
  narrators: z.array(z.object({ name: z.string() })).default([]),

  // Content
  runtime_length_min: z.number().nonnegative().default(0),
  publisher_name: optionalString,
  language: optionalString,
  release_date: optionalString,
  publisher_summary: optionalString,
  extended_product_description: optionalString,
  merchandising_summary: optionalString,
  copyright: optionalString,
  format_type: optionalString,
  content_type: optionalString,
  content_delivery_type: optionalString,
  program_participation: optionalString,

  // Images
  product_images: z
    .record(z.string(), z.string())
    .nullish()
    .transform((v) => v ?? {}),

  social_media_images: z
    .record(z.string(), z.string())
    .nullish()
    .transform((v) => v ?? {}),

  // Classification
  series: z
    .array(
      z.object({
        asin: z.string(),
        title: z.string(),
        sequence: optionalString,
      }),
    )
    .nullish()
    .transform((v) => v ?? []),

  category_ladders: z
    .array(categoryLadderSchema)
    .nullish()
    .transform((v) => v ?? []),

  platinum_keywords: z
    .array(z.string())
    .nullish()
    .transform((v) => v ?? []),
  thesaurus_subject_keywords: z
    .array(z.string())
    .nullish()
    .transform((v) => v ?? []),

  // Rating
  rating: audibleRatingSchema,

  // Listening status
  listening_status: z
    .object({
      is_finished: z.boolean().optional(),
      percent_complete: z.number().optional(),
      finished_at_timestamp: z.string().nullish(),
      time_remaining_seconds: z.number().optional(),
    })
    .nullish()
    .transform(nullToUndefined),

  // Library metadata
  purchase_date: optionalString,
  library_status: z
    .object({
      date_added: z.string().nullish(),
    })
    .nullish()
    .transform(nullToUndefined),

  // Relationships
  relationships: z
    .array(relationshipSchema)
    .nullish()
    .transform((v) => v ?? []),

  // Flags
  is_adult_product: z
    .boolean()
    .nullish()
    .transform((v) => v ?? false),
})
