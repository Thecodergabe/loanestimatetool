import { defineNuxtConfig } from 'nuxt/config'
import compression from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * @file nuxt.config.ts
 * @description Master Production Config for 2026.
 * Merges high-performance Vite/Nitro settings with centralized Vuetify module config.
 */
export default defineNuxtConfig({
  ssr: false,

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/robots'
  ],

  // Centralized Vuetify Setup (Removes need for plugins/vuetify.js)
  // @ts-ignore
  vuetify: {
    moduleOptions: {
      treeshaking: true,
      useIconCDNs: true,
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              background: '#0F172A', // Studio Navy
              surface: '#1E293B',
              primary: '#3B82F6',    // Studio Blue
              accent: '#14B8A6',
              pmi: '#7C4DFF',
            }
          }
        }
      },
      defaults: {
        VCard: { elevation: 0, rounded: 'xl' },
        VTextField: { variant: 'filled', rounded: 'lg', color: 'primary' },
        VSelect: { variant: 'filled', rounded: 'lg', color: 'primary' },
        VBtn: { elevation: 0, class: 'text-none font-weight-bold' }
      }
    }
  },

  app: {
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Loan Estimate Tool | Precise 2026 Mortgage Planning',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Instant ZIP-level insurance and tax estimates for mortgage planning.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Loan Estimate Tool | 2026 Mortgage Calculator' },
        { property: 'og:description', content: 'Get ZIP-specific insurance and tax estimates instantly.' },
        { property: 'og:image', content: 'https://www.loanestimatetool.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css' }
      ],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/mortgage-loan-guide': { prerender: true },
    '/home-insurance': { prerender: true },
    '/property-taxes': { prerender: true },
    '/mortgage-pmi': { prerender: true },
  },

  compatibilityDate: '2025-05-15',

  nitro: {
    compressPublicAssets: true,
    preset: 'cloudflare-pages',
    static: true,
    prerender: {
      routes: [
        '/', 
        '/mortgage-loan-guide', 
        '/home-insurance', 
        '/property-taxes', 
        '/mortgage-pmi'
      ],
      autoSubfolderIndex: false
    },
  },

  vite: {
    plugins: [
      compression({ algorithm: 'brotliCompress' }),
      ...(process.env.NODE_ENV === 'development' ? [visualizer({ open: false, filename: 'dist/stats.html' })] : [])
    ],
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) return 'vuetify'
              if (id.includes('chart.js')) return 'chartjs'
            }
          }
        }
      }
    }
  }
} as any)