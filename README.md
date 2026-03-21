# audible-api-ts

[![CI](https://github.com/moifort/audible-api-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/moifort/audible-api-ts/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/audible-api-ts)](https://www.npmjs.com/package/audible-api-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**A fully typed TypeScript client for the Audible API.**

Authentication, library, wishlist — all with complete type safety. The first maintained TypeScript alternative to [mkb79/Audible](https://github.com/mkb79/Audible) (Python).

**[Documentation](https://moifort.github.io/audible-api-ts)**

## Features

- **Complete PKCE authentication** — Same OAuth flow as the official Audible iOS app
- **Signed API requests** — RSA SHA256 request signing with device private key
- **Library & wishlist** — Fetch all audiobooks with automatic pagination
- **10 locales** — US, UK, France, Germany, Italy, Spain, Canada, Australia, India, Japan
- **Fully typed** — Every function, response, and credential has TypeScript types
- **Minimal dependencies** — Only `zod` for response validation

## Install

```bash
bun add audible-api-ts
# or
npm install audible-api-ts
```

Requires Node.js 18+ (for native `fetch` and `crypto`).

## Quick Start

```typescript
import {
  generateLoginUrl,
  registerDevice,
  fetchLibrary,
} from 'audible-api-ts'

// 1. Generate login URL
const { loginUrl, session, cookies } = await generateLoginUrl('com')
// → Redirect user to loginUrl (set cookies first)

// 2. After login, register the device
const credentials = await registerDevice(authorizationCode, session)

// 3. Fetch the library
const { items } = await fetchLibrary(credentials)

for (const book of items) {
  console.log(`${book.title} by ${book.authors.join(', ')}`)
  // → "Dune by Frank Herbert"
}
```

## API

| Function | Description |
|----------|-------------|
| `generateLoginUrl(locale)` | Generate PKCE login URL + session + cookies |
| `registerDevice(code, session)` | Exchange auth code for credentials |
| `refreshAccessToken(credentials)` | Refresh an expired access token |
| `fetchLibrary(credentials)` | Fetch all library audiobooks |
| `fetchWishlist(credentials)` | Fetch all wishlist audiobooks |
| `verifyConnection(credentials)` | Check if credentials are valid |

See the **[full documentation](https://moifort.github.io/audible-api-ts)** for guides and API reference.

## License

MIT
