import { z } from 'zod'

const nullToUndefined = <T>(v: T | null | undefined): T | undefined => v ?? undefined

const optionalString = z.string().nullish().transform(nullToUndefined)

/** Amazon sends `null` for a field it has no value for as often as it leaves the
 *  field out. A `.default()` only covers the second, so a null is read as absent
 *  first and the default applies to both. */
const absentIfNull = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === null ? undefined : v), schema)

const ratingDistributionSchema = z.object({
  average_rating: z.number(),
  display_average_rating: absentIfNull(z.string().default('0')),
  display_stars: absentIfNull(z.number().default(0)),
  num_ratings: z.number(),
  num_five_star_ratings: absentIfNull(z.number().default(0)),
  num_four_star_ratings: absentIfNull(z.number().default(0)),
  num_three_star_ratings: absentIfNull(z.number().default(0)),
  num_two_star_ratings: absentIfNull(z.number().default(0)),
  num_one_star_ratings: absentIfNull(z.number().default(0)),
})

export const audibleRatingSchema = z
  .object({
    num_reviews: absentIfNull(z.number().default(0)),
    overall_distribution: ratingDistributionSchema.nullish(),
    performance_distribution: ratingDistributionSchema.nullish(),
    story_distribution: ratingDistributionSchema.nullish(),
  })
  .nullish()

const categoryLadderSchema = z.object({
  root: absentIfNull(z.string().default('Genres')),
  ladder: absentIfNull(
    z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .default([]),
  ),
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
/** `GET /1.0/annotations/lastpositions`: where the reader last stopped in each
 *  asked title. A title never opened answers `DoesNotExist` and nothing else. */
export const lastPositionsSchema = z.object({
  asin_last_position_heard_annots: z
    .array(
      z.object({
        asin: z.string(),
        last_position_heard: z.object({
          status: z.string(),
          position_ms: z.number().nullish(),
          last_updated: z.string().nullish(),
        }),
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
})

export const audibleRawItemSchema = z.object({
  // Identity
  asin: z.string().min(1),
  title: z.string().min(1),
  subtitle: optionalString,
  isbn: optionalString,
  sku: optionalString,

  // People
  authors: absentIfNull(z.array(z.object({ name: z.string() })).default([])),
  narrators: absentIfNull(z.array(z.object({ name: z.string() })).default([])),

  // Content
  runtime_length_min: absentIfNull(z.number().nonnegative().default(0)),
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

/** A chapter as the licence lists it. A part ("Première partie") nests its own
 *  chapters; its own length covers only what plays before the first of them. */
type RawChapter = {
  title: string
  start_offset_ms: number
  length_ms: number
  chapters?: RawChapter[] | null
}

const rawChapterSchema: z.ZodType<RawChapter> = z.lazy(() =>
  z.object({
    title: z.string(),
    start_offset_ms: z.number(),
    length_ms: z.number(),
    chapters: z.array(rawChapterSchema).nullish(),
  }),
)

const lastPositionHeardSchema = z
  .object({
    status: z.string(),
    position_ms: z.number().nullish(),
    last_updated: z.string().nullish(),
  })
  .nullish()

export const licenseResponseSchema = z.object({
  content_license: z.object({
    status_code: z.string(),
    asin: z.string(),
    acr: z.string().nullish(),
    drm_type: z.string().nullish(),
    license_response: z.string().nullish(),
    certificate: z.string().nullish(),
    license_denial_reasons: z
      .array(
        z.object({
          message: z.string().nullish(),
          rejectionReason: z.string().nullish(),
          validationType: z.string().nullish(),
        }),
      )
      .nullish(),
    content_metadata: z
      .object({
        chapter_info: z
          .object({
            brandIntroDurationMs: z.number().nullish(),
            brandOutroDurationMs: z.number().nullish(),
            is_accurate: z.boolean().nullish(),
            runtime_length_ms: z.number(),
            chapters: z.array(rawChapterSchema).nullish(),
          })
          .nullish(),
        content_reference: z
          .object({ codec: z.string().nullish(), content_format: z.string().nullish() })
          .nullish(),
        last_position_heard: lastPositionHeardSchema,
      })
      .nullish(),
  }),
})

export const drmLicenseResponseSchema = z.object({ license: z.string().min(1) })
