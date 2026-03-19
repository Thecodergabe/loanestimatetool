import { defineNuxtPlugin } from 'nuxt/app'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import 'vuetify/styles'

// Import missing components used in our new layouts
import {
  VApp, VAppBar, VBtn, VCard, VContainer, VDivider,
  VIcon, VTextField, VSelect, VForm, VSpacer,
  VToolbar, VTooltip, VSkeletonLoader, VImg, VAvatar,
  VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
  VRow, VCol, VSlider, VSwitch, VFooter, VChip
} from 'vuetify/components'

import { Ripple, Intersect, Scroll } from 'vuetify/directives'

/**
 * Modern FinTech Identity - Light Theme
 * Optimized for readability and high-contrast 'Inter' aesthetics.
 */
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#F8FAFC', // Slate-50 background for that modern app feel
    surface: '#FFFFFF',
    primary: '#1976D2',    // Trust Blue
    secondary: '#64748B',  // Slate-500 for captions
    accent: '#00BFA5',     // Teal used in Insurance & Risk
    pmi: '#7C4DFF',        // Deep Purple for PMI
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',    // Interest rate orange
  },
}

/**
 * High-End Dark Mode
 * Avoids pure black to maintain depth and reduce eye strain.
 */
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0F172A', // Deep Navy base
    surface: '#1E293B',    // Lighter Navy surface
    primary: '#3B82F6',    // Vibrant Blue for dark mode
    secondary: '#94A3B8',
    accent: '#14B8A6',
    error: '#F87171',
    info: '#38BDF8',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VApp, VAppBar, VBtn, VCard, VContainer, VDivider,
      VIcon, VTextField, VSelect, VForm, VSpacer,
      VToolbar, VTooltip, VSkeletonLoader, VImg, VAvatar,
      VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
      VRow, VCol, VSlider, VSwitch, VFooter, VChip
    },
    directives: { Ripple, Intersect, Scroll },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    // Global defaults to ensure the "Beautiful Modern" look across all components
    defaults: {
      VCard: {
        elevation: 0,
        rounded: 'xl',
      },
      VTextField: {
        variant: 'filled',
        rounded: 'lg',
        color: 'primary',
      },
      VSelect: {
        variant: 'filled',
        rounded: 'lg',
        color: 'primary',
      },
      VBtn: {
        elevation: 0,
        fontWeight: 'bold',
        textTransform: 'none', // Critical for modern typography
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})