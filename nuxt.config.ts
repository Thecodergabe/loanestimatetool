import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'
import compression from 'vite-plugin-compression2'

export default defineNuxtConfig({
  // Ensures compatibility with Cloudflare Pages runtime

  modules: [
    // Vuetify integration via Vite plugin
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins ||= []
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  app: {
    buildAssetsDir: '/_nuxt/', // optional: ensure asset path is correct
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
    payloadExtraction: true, // ✅ Reduces JS payload size for prerendered pages
  },
  compatibilityDate: '2025-05-15',
  nitro: {
    compressPublicAssets: true,
    // preset: 'node',
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
      compression({ algorithms: ['brotliCompress'] })
    ],
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      minify: 'esbuild', // ✅ Use esbuild for faster, safer JS minification
    },
  },
})
