import { defineNuxtConfig } from 'nuxt/config'
import compression from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineNuxtConfig({
  ssr: false,

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  runtimeConfig: {
    public: {
      siteUrl: 'https://www.loanestimatetool.com',
    },
    robots: {
      UserAgent: '*',
      Disallow: '',
      Sitemap: 'https://www.loanestimatetool.com/sitemap.xml',
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
        { property: 'og:image', content: 'https://www.loanestimatetool.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css'
        }
      ],
    },
  },

  plugins: [
    { src: './plugins/initZipData.server.ts', mode: 'server' },
  ],

  css: [
    'vuetify/styles'
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
    '/loanguide': {
      prerender: true,
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
  },

  experimental: {
    appManifest: false,
    payloadExtraction: true,
    emitRouteChunkError: false,
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    compressPublicAssets: true,
    preset: 'cloudflare-pages',
    serveStatic: true,
    static: true,
    prerender: {
      routes: ['/', '/loanguide', '/sitemap.xml'],
    },

  },

  vite: {
    plugins: [
      compression({ algorithms: ['brotliCompress'] }),
      ...(process.env.NODE_ENV === 'development' ? [visualizer({ open: false, filename: 'dist/stats.html' })] : [])
    ],
    
    define: {
      'process.env.DEBUG': false,
    },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) return 'vuetify'
              if (id.includes('chart.js')) return 'chartjs'
            }
          }
        }
      }
    }
  }
})