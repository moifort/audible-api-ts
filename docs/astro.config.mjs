// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://moifort.github.io',
  base: '/audible-api-ts',
  integrations: [
    starlight({
      title: 'audible-api-ts',
      description: 'A fully typed TypeScript client for the Audible API',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/moifort/audible-api-ts',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Getting Started', slug: 'getting-started' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Authentication', slug: 'guides/authentication' },
            { label: 'Library & Wishlist', slug: 'guides/library' },
            { label: 'Token Refresh', slug: 'guides/token-refresh' },
            { label: 'Locales', slug: 'guides/locales' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'API', slug: 'reference/api' },
            { label: 'Types', slug: 'reference/types' },
          ],
        },
      ],
    }),
  ],
})
