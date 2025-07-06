import { defineNuxtPlugin } from 'nuxt/app'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css' // ✅ Import the font CSS

import {
  VApp, VAppBar, VBtn, VCard, VContainer, VDivider,
  VIcon, VTextField, VSelect, VForm, VSpacer,
  VToolbar, VTooltip, VSkeletonLoader,
} from 'vuetify/components'

import {
  Ripple, Intersect, Scroll,
} from 'vuetify/directives'

import { aliases, mdi } from 'vuetify/iconsets/mdi' // ✅ Font-based icon set

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VApp, VAppBar, VBtn, VCard, VContainer, VDivider,
      VIcon, VTextField, VSelect, VForm, VSpacer,
      VToolbar, VTooltip, VSkeletonLoader,
    },
    directives: {
      Ripple, Intersect, Scroll,
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
