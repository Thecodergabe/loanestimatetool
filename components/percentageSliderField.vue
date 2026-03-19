<template>
  <div class="d-flex flex-column mb-4 mb-md-0">
    <label 
      :for="inputId" 
      :id="labelId" 
      class="sr-only"
    >
      {{ label }}
    </label>

    <div class="d-flex align-center flex-grow-1">
      <v-slider
        v-model="internalValue"
        :min="min"
        :max="max"
        :step="step"
        show-ticks
        :thumb-label="true"
        hide-details="auto"
        track-color="grey"
        color="primary"
        class="flex-grow-1 me-4 w-100"
        :aria-labelledby="labelId"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="internalValue"
      >
        <template v-if="!smAndDown" #prepend>
          <v-btn
            color="primary"
            icon="mdi-minus"
            size="small"
            variant="text"
            :aria-label="`Decrease ${label}`"
            @click="decrement"
          />
        </template>

        <template v-if="!smAndDown" #append>
          <v-btn
            color="primary"
            icon="mdi-plus"
            size="small"
            variant="text"
            :aria-label="`Increase ${label}`"
            @click="increment"
          />
        </template>
      </v-slider>

      <v-text-field
        v-model.number="internalValue"
        :id="inputId"
        :suffix="suffix"
        type="number"
        :max="max"
        :min="min"
        hide-details="auto"
        width="170px"
        density="compact"
        class="percent-input"
        :aria-labelledby="labelId"
        variant="filled"
        :block="smAndDown"
        :style="inputStyle"
      />
    </div>

    <div v-if="caption" class="text-caption text-medium-emphasis mt-1">
      {{ caption }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file components/percentageSliderField.vue
 * @description A synchronized Slider + Text Field component.
 * Optimized for mortgage inputs like Interest Rates and Down Payments.
 * Supports SSR-safe ID generation and Vuetify 3.
 */
import { computed, toRefs } from 'vue'
import { useDisplay } from 'vuetify'

interface Props {
  /** Unique ID for HTML associations */
  inputId: string
  /** v-model binding value */
  modelValue: number
  /** Human-readable label (used for Screen Readers) */
  label?: string
  /** Helper text displayed below the input */
  caption?: string
  /** Minimum slider value */
  min?: number
  /** Maximum slider value */
  max?: number
  /** Slider increment step */
  step?: number
  /** Suffix for the text input (e.g., '%', 'yrs') */
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Input Field',
  caption: '',
  min: 0,
  max: 100,
  step: 1,
  suffix: '%',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { modelValue, min, max, step, inputId } = toRefs(props)
const { smAndDown } = useDisplay()

/**
 * Unique Label ID for ARIA relationships.
 */
const labelId = computed(() => `${inputId.value}-label`)

/**
 * Dynamic styling to ensure the text field remains readable on mobile.
 */
const inputStyle = computed(() =>
  !smAndDown.value 
    ? { minWidth: '100px' } 
    : { maxWidth: '100%' }
)

/**
 * Two-way binding logic for v-model.
 */
const internalValue = computed({
  get: () => modelValue.value,
  set: (val: number) => emit('update:modelValue', val),
})

/**
 * Manual increment/decrement logic for the action buttons.
 */
const increment = () => {
  if (internalValue.value < max.value) {
    internalValue.value = Number((internalValue.value + step.value).toFixed(2))
  }
}

const decrement = () => {
  if (internalValue.value > min.value) {
    internalValue.value = Number((internalValue.value - step.value).toFixed(2))
  }
}
</script>

<style scoped>
/**
 * Custom styling for the slider thumb label to improve readability 
 * against different background colors.
 */
:deep(.v-slider-thumb__label) {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  font-weight: bold;
  border-radius: 4px;
}

/**
 * Accessibility utility: Hides elements visually but keeps them in the DOM 
 * for screen readers (WCAG compliance).
 */
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>