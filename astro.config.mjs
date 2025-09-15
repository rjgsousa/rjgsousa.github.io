// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  site: 'https://rsousa.co',
  base: '/',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  ...(isDev && {
    server: {
      host: true
    }
  }),
  vite: {
    plugins: [tailwindcss()],
    ...(isDev && {
      server: {
        host: true,
        allowedHosts: [
          'rsousa.co',
          'localhost',
          '127.0.0.1'
        ]
      }
    })
  },
  build: {
    assets: 'assets'
  }
});