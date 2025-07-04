<template>
  <div class="d-flex align-center mb-4">
    <!-- Slider takes most of the space -->
    <v-slider v-model.number="internalValue"
                :min="props.min ?? 0"
              :max="max"
              :step="step"
              :label="label"
              thumb-label
              hide-details
              color="primary"
              density="default"
              class="flex-grow-1 me-2" />

    <!-- Input sized for 3-digit percentages -->
    <v-text-field v-model.number="internalValue"
                  :suffix="suffix"
                  type="number"
                  hide-details
                  :max="max"
                  :min="min"
                  density="default"
                  class="percent-input"
                  style="max-width: 80px" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  label?: string
  min?: number
  max?: number
  step?: number
  suffix?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (val: number) => emit('update:modelValue', val)
})
</script>