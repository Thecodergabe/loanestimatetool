<template>
  <v-btn icon
         :aria-label="modelValue ? 'Switch to light mode' : 'Switch to dark mode'"
         @click="toggleTheme"
         class="ma-2"
         variant="text">
    <v-icon>{{ modelValue ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
/**
 * @file components/themeToggle.vue
 * @description Small toggle button that switches between Vuetify's
 * global light and dark themes. Uses v-model for two‑way binding so
 * parent components can stay in sync with the current theme state.
 */

import { useTheme } from 'vuetify'

/**
 * modelValue = true  → currently dark mode
 * modelValue = false → currently light mode
 */
const props = defineProps<{
  modelValue?: boolean
}>()

/**
 * Emits the updated theme state back to the parent.
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

/**
 * Access Vuetify's global theme controller.
 */
const theme = useTheme()

/**
 * Toggles between light and dark themes.
 * Updates both Vuetify's global theme and the v-model binding.
 */
function toggleTheme() {
  theme.global.name.value = props.modelValue ? 'light' : 'dark'
  emit('update:modelValue', !props.modelValue)
}
</script>