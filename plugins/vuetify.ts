// plugins/vuetify.ts
import { defineNuxtPlugin } from 'nuxt/app'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import {
  VApp, VAppBar, VBtn, VCard, VContainer, VDivider,
  VIcon, VTextField, VSelect, VForm, VSpacer,
  VToolbar, VTooltip, VSkeletonLoader,
} from 'vuetify/components'

import {
  Ripple, Intersect, Scroll,
} from 'vuetify/directives'

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
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            background: '#F5F5F5',
            surface: '#FFFFFF',
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
        dark: {
          dark: true,
          colors: {
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#90CAF9',
            secondary: '#B0BEC5',
            accent: '#FF4081',
            error: '#EF9A9A',
            info: '#81D4FA',
            success: '#A5D6A7',
            warning: '#FFE082',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})