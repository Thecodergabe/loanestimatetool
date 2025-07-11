<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    :class="btnClass"
    @click="scrollToTarget"
    :aria-label="ariaLabel"
  >
    <slot>Scroll</slot>
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  target: { type: String, required: true }, // ID selector
  offset: { type: Number, default: 0 },
  behavior: { type: String as () => 'auto' | 'smooth', default: 'smooth' },
  color: { type: String, default: 'primary' },
  variant: { type: String as () => 'elevated' | 'text' | 'flat' | 'tonal' | 'outlined' | 'plain', default: 'elevated' },
  size: { type: String, default: 'default' },
  block: { type: Boolean, default: false },
  btnClass: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Scroll to section' },
})

const scrollToTarget = () => {
  const el = document.querySelector(props.target)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY + props.offset
    window.scrollTo({ top: y, behavior: props.behavior })
  }
}
</script>