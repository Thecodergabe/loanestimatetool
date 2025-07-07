<template>
  <div class="d-flex flex-column mb-4 mb-md-0">
    <!-- Hidden label for screen readers -->
    <label :for="inputId"
           :id="labelId"
           class="sr-only">{{ label }}</label>

    <div class="d-flex align-center flex-grow-1">
      <v-slider v-model="internalValue"
                :min="min ?? 0"
                :max="max"
                :step="step"
                show-ticks
                :thumb-label="true"
                hide-details="auto"
                track-color="grey"
                color="primary"
                dark
                class="flex-grow-1 me-2 w-100"
                :aria-labelledby="`${inputId}-label`"
                role="slider"
                :aria-valuemin="min ?? 0"
                :aria-valuemax="max"
                :aria-valuenow="internalValue">
        <template v-show="!mobile"
                  #prepend>
          <v-btn color="primary"
                 icon="mdi-minus"
                 size="small"
                 variant="text"
                 :aria-label="`subtract one from ${label}`"
                 @click="internalValue--" />
        </template>

        <template v-show="!mobile"
                  #append>
          <v-btn color="primary"
                 icon="mdi-plus"
                 size="small"
                 variant="text"
                 :aria-label="`add one to ${label}`"
                 @click="internalValue++" />
        </template>
      </v-slider>

      <v-text-field v-model.number="internalValue"
                    :id="inputId"
                    :suffix="suffix"
                    type="number"
                    :max="max"
                    :min="min"
                    hide-details="auto"
                    density="compact"
                    class="percent-input"
                    :aria-labelledby="`${inputId}-label`"
                    variant="filled"
                    :block="mobile"
                    :style="inputStyle" />
    </div>

    <div v-if="caption"
         class="text-caption text-medium-emphasis">
      {{ caption }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const labelId = computed(() => `${inputId.value}-label`)
const inputStyle = computed(() =>
  !mobile.value
    ? { minWidth: 'max-content' }
    : { maxWidth: '100%' }
)

const props = withDefaults(
  defineProps<{
    inputId: string
    modelValue: number
    ariaLabel: string
    label?: string
    caption?: string
    hint?: string
    min?: number
    max?: number
    step?: number
    suffix?: string
  }>(),
  {
    label: '',
    caption: '',
    hint: '',
    min: 0,
    max: 100,
    step: 1,
    suffix: '%',
  }
)

const { modelValue, label, min, max, step, suffix, inputId, caption } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const internalValue = computed({
  get: (): number => modelValue.value,
  set: (val: number) => emit('update:modelValue', val),
})
</script>

<style lang="css" scoped>
:deep(.v-slider-thumb__label) {
  background-color: white;
  border: 1px solid #ccc;
  font-weight: 500;
}
</style>
<style lang="css" scoped>
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
</style>