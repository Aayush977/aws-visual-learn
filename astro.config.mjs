// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * GitHub Pages config.
 *
 * For a PROJECT site (https://<user>.github.io/<repo>) leave `base` set to the
 * repo name. For a USER site (https://<user>.github.io) set `base` to '/'.
 * The deploy workflow overrides both via env vars, so you only edit them here
 * for local previews.
 */
const SITE = process.env.SITE_URL ?? 'https://example.github.io';
const BASE = process.env.BASE_PATH ?? '/aws-visual-learn';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
