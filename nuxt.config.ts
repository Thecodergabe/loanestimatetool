
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
    build: {
    transpile: ['vuetify'],
  },
    modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils'
  ],
  css: ['vuetify/styles','@mdi/font/css/materialdesignicons.min.css'],
  plugins: ['~/plugins/vuetify.ts'],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  nitro: {
    preset: 'cloudflare-pages',
    serveStatic: true
  },
  ssr: true,
})