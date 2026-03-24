<template>
  <v-btn
    :color="color"
    :size="size"
    :variant="variant"
    class="text-none font-weight-bold px-8 rounded-pill"
    @click="scrollToTarget"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
/**
 * @file components/scrollToBtn.vue
 * @description Button component for smooth in‑page scrolling.
 */

interface Props {
  /** CSS selector for the scroll target (e.g., '#calculator-top') */
  target: string
  color?: string
  size?: string
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  size: 'default',
  variant: 'elevated',
})

/**
 * Smoothly scrolls to the target element.
 */
const scrollToTarget = () => {
  if (typeof window === 'undefined') return

  const element = document.querySelector(props.target)

  if (element) {
    const topOffset = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: topOffset - 40,
      behavior: 'smooth',
    })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Optional: Add a slight hover lift effect to match the 'Pro' feel */
.v-btn {
  transition: transform 0.2s ease;
}
.v-btn:hover {
  transform: translateY(-2px);
}
</style>