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
import { useTheme } from 'vuetify'
const props = defineProps<{
  modelValue?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = props.modelValue ? 'light' : 'dark'
  emit('update:modelValue', !props.modelValue)
}
</script>