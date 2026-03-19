/**
 * @file composables/useNavigation.ts
 * @description Global navigation state to coordinate CTAs across layouts and pages.
 */
import { ref } from 'vue';

const scrollToCalculatorTrigger = ref(0);

export const useNavigation = () => {
  const triggerGetStarted = () => {
    scrollToCalculatorTrigger.value++;
  };

  return {
    scrollToCalculatorTrigger,
    triggerGetStarted
  };
};