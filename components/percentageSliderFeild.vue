<template>
  <div class="d-flex flex-column mb-4">
    <div class="d-flex align-center">
      <!-- Slider takes most of the space -->
      <v-slider v-model="internalValue"
                :min="min ?? 0"
                :max="max"
                :step="step"
                :label="label"
                show-ticks
                :thumb-label="true"
                hide-details
                track-color="grey"
                color="primary"
                dark
                class="flex-grow-1 me-2">
        <template v-slot:prepend>
          <v-btn color="primary"
                 icon="mdi-minus"
                 size="small"
                 variant="text"
                 @click="internalValue--"></v-btn>
        </template>

        <template v-slot:append>
          <v-btn color="primary"
                 icon="mdi-plus"
                 size="small"
                 :hint="hint"
                 variant="text"
                 @click="internalValue++"></v-btn>
        </template>
      </v-slider>

      <!-- Input sized for 3-digit percentages -->
      <v-text-field v-model.number="internalValue"
                    :suffix="suffix"
                    type="number"
                    hide-details
                    :max="max"
                    :min="min"
                    density="compact"
                    class="percent-input"
                    variant="solo"
                    style="max-width: 80px" />
    </div>
    <div v-if="displayResult"
         class="text-caption text-medium-emphasis mt-n4 ml-2">
      {{ displayResult }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  displayResult?: string
  hint?: string
  label?: string
  min?: number
  max?: number
  step?: number
  suffix?: string
}>()

const { modelValue, label, min, max, step, suffix, hint } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internalValue = computed({
  get: (): number => modelValue.value,
  set: (val: number) => emit('update:modelValue', val)
})
</script>

<style lang="css" scoped>
:deep(.v-slider-thumb__label) {
  background-color: white;
  border: 1px solid #ccc;
  font-weight: 500;
}

</style>