import { defineNuxtConfig } from 'nuxt/config'
import compression from 'vite-plugin-compression2'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module', '@nuxtjs/sitemap', '@nuxtjs/robots', ['nuxt-delay-hydration', {
    mode: 'mount',
    debug: process.env.NODE_ENV === 'development',
  }], '@nuxtjs/sitemap'],

  runtimeConfig: {
    public: {
      siteUrl: 'https://loanestimatetool.com',
      
    },
    robots: {
      UserAgent: '*',
      Disallow: '',
      Sitemap: 'https://loanestimatetool.com/sitemap.xml',
    },
  },
  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Loan Estimate Tool',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Instant ZIP-level insurance and tax estimates for mortgage planning.' },
        { property: 'og:title', content: 'Loan Estimate Tool' },
        { property: 'og:description', content: 'Get ZIP-specific insurance and tax estimates instantly.' },
        { property: 'og:image', content: 'https://loanestimatetool.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  plugins: [
    { src: './plugins/initZipData.server.ts', mode: 'server' },
  ],

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  routeRules: {
    '/': {
      prerender: true,
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
    '/**': {
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
  },

  experimental: {
    appManifest: false,
    payloadExtraction: true,
    emitRouteChunkError: false, // fallback to full reload
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    compressPublicAssets: true,
    preset: 'cloudflare-pages',
    serveStatic: true,
    static: true,
  },

  vite: {
    plugins: [
      compression({ algorithms: ['brotliCompress'] }),
    ],
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      minify: 'esbuild',
    },
  },
})