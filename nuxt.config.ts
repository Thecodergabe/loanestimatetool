import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'
import compression from 'vite-plugin-compression2'

export default defineNuxtConfig({
  modules: [
    [
      'nuxt-delay-hydration',
      {
        mode: 'mount',
        debug: process.env.NODE_ENV === 'development',
      },
    ],
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins ||= []
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Loan Estimate Tool',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'description', content: 'Instant ZIP-level insurance and tax estimates for mortgage planning.' },
        { property: 'og:title', content: 'Loan Estimate Tool' },
        { property: 'og:description', content: 'Get ZIP-specific insurance and tax estimates instantly.' },
        { property: 'og:image', content: 'https://yourdomain.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  plugins: [
    './plugins/vuetify.ts',
    { src: './plugins/initZipData.server.ts', mode: 'server' },
  ],

  ssr: true,
  components: true,

  devtools: {
    enabled: true,
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  build: {
    transpile: ['vuetify'],
  },

  routeRules: {
    '/': { prerender: true },
  },

  experimental: {
    appManifest: false,
    payloadExtraction: true,
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    compressPublicAssets: true,
    preset: 'cloudflare-pages',
    serveStatic: true,
    static: true,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({ autoImport: true }),
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