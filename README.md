# audible-api-ts

[![CI](https://github.com/moifort/audible-api-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/moifort/audible-api-ts/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/audible-api-ts)](https://www.npmjs.com/package/audible-api-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**A fully typed TypeScript client for the Audible API.**

Authentication, library, wishlist, catalog search — all with complete type safety. The first maintained TypeScript alternative to [mkb79/Audible](https://github.com/mkb79/Audible) (Python).

**[Documentation](https://moifort.github.io/audible-api-ts)**

## Features

- **Complete PKCE authentication** — Same OAuth flow as the official Audible iOS app
- **Signed API requests** — RSA SHA256 request signing with device private key
- **Library & wishlist** — Fetch all audiobooks with automatic pagination
- **Catalog search** — Browse by category, sort by bestsellers or rating
- **Full data** — Ratings (overall/performance/story), categories, listening progress, series, cover images, and more
- **10 locales** — US, UK, France, Germany, Italy, Spain, Canada, Australia, India, Japan
- **Fully typed** — Every function, response, and credential has TypeScript types

## Install

```bash
bun add audible-api-ts
# or
npm install audible-api-ts
```

Requires Node.js 18+ (for native `fetch` and `crypto`).

## Quick Start

```typescript
import { generateLoginUrl, registerDevice, fetchLibrary } from 'audible-api-ts'

// 1. Authenticate
const { loginUrl, session, cookies } = await generateLoginUrl('com')
// → Redirect user to loginUrl (set cookies first)
const credentials = await registerDevice(authorizationCode, session)

// 2. Fetch library
const { items } = await fetchLibrary(credentials)

items.map((book) => {
  console.log(`${book.title} by ${book.authors.join(', ')}`)
  console.log(`  Rating: ${book.rating?.overallDistribution?.averageRating}/5`)
  console.log(`  Duration: ${Math.floor(book.durationMinutes / 60)}h${book.durationMinutes % 60}m`)
  if (book.series) console.log(`  Series: ${book.series.name} #${book.series.position}`)
  if (book.listeningStatus?.percentComplete) {
    console.log(`  Progress: ${book.listeningStatus.percentComplete}%`)
  }
})
```

**Output:**
```
Primal Hunter by Zogarth
  Rating: 4.8/5
  Duration: 29h30m
  Series: Primal Hunter #4
  Progress: 5%
Dune by Frank Herbert
  Rating: 4.7/5
  Duration: 18h0m
```

## Catalog Search

```typescript
import { fetchCatalog } from 'audible-api-ts'

// Top Science Fiction books sorted by popularity
const { items } = await fetchCatalog(credentials, {
  categoryId: '18580628011',   // Science Fiction (US)
  sortBy: 'BestSellers',
  numResults: 10,
})

items.map((book) =>
  console.log(
    `${book.title} — ${book.rating?.overallDistribution?.numRatings} ratings, ` +
    `${book.rating?.overallDistribution?.averageRating?.toFixed(1)}/5`
  )
)
```

**Output:**
```
Project Hail Mary — 82341 ratings, 4.9/5
Dune — 45210 ratings, 4.7/5
The Hitchhiker's Guide to the Galaxy — 38102 ratings, 4.6/5
```

## API

| Function | Description |
|----------|-------------|
| `generateLoginUrl(locale)` | Generate PKCE login URL + session + cookies |
| `registerDevice(code, session)` | Exchange auth code for credentials |
| `refreshAccessToken(credentials)` | Refresh an expired access token |
| `fetchLibrary(credentials)` | Fetch all library audiobooks |
| `fetchWishlist(credentials)` | Fetch all wishlist audiobooks |
| `fetchCatalog(credentials, options)` | Search catalog by category with sorting |
| `verifyConnection(credentials)` | Check if credentials are valid |

See the **[full documentation](https://moifort.github.io/audible-api-ts)** for guides and API reference.

## License

MIT
