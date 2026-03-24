# audible-api-ts

## Build & Verification Commands

- **Type-check**: `bun tsc --noEmit`
- **Unit tests**: `bun test`
- **Integration tests**: `bun run test:int` (requires `.env` with `AUDIBLE_CREDENTIALS`)
- **Lint**: `bunx biome check`
- **Lint fix**: `bunx biome check --write`
- **Build**: `bun run build`
- **Build docs**: `cd docs && bun run build`
- **Runtime**: always use `bun`/`bunx`, never `npm`/`npx`

## Code Style

- **No `for`/`while` loops** — use `map`/`filter`/`reduce` + lodash-es (`orderBy`, `uniqBy`)
- **No semicolons**, single quotes, 2-space indent (Biome)
- **Recursive pagination** instead of while loops (see `fetchAllPages` in `src/fetch.ts`)

## Documentation Checklist

When modifying the public API (functions, types, options), **all** of the following must be updated:

- `README.md` — Quick Start, API table, examples
- `llms.txt` — Complete API reference for LLMs (root + `docs/public/llms.txt`)
- `docs/src/content/docs/index.mdx` — Landing page Quick Example
- `docs/src/content/docs/getting-started.mdx` — Installation + first usage
- `docs/src/content/docs/guides/authentication.mdx` — Auth flow guide
- `docs/src/content/docs/guides/library.mdx` — Library & Wishlist guide
- `docs/src/content/docs/guides/catalog.mdx` — Catalog search guide (genres, sub-genres, sorting)
- `docs/src/content/docs/guides/token-refresh.mdx` — Token refresh guide
- `docs/src/content/docs/guides/locales.mdx` — Locales guide
- `docs/src/content/docs/reference/api.mdx` — Full API reference
- `docs/src/content/docs/reference/types.mdx` — All exported types

## Test Suffixes

- `*.unit.test.ts` — Unit tests (no IO)
- `*.int.test.ts` — Integration tests (real API calls, requires credentials)
- Tests are co-located next to their source files
