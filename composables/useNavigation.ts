/**
 * @file composables/useNavigation.ts
 * @description Global navigation state used to coordinate CTAs across pages and layouts.
 */
import { ref } from 'vue'

const scrollToCalculatorTrigger = ref(0)

export const useNavigation = () => {
  const triggerGetStarted = () => {
    scrollToCalculatorTrigger.value++
  }

  return {
    scrollToCalculatorTrigger,
    triggerGetStarted,
  }
}