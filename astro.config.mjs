// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://healthcoveragepath.com',
  output: 'server',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/api/') })],
  adapter: cloudflare(),
});
