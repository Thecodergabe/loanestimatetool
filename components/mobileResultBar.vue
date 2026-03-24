<template>
  <v-no-ssr>
    <v-slide-y-reverse-transition>
      <div v-if="shouldShow" class="mobile-sticky-footer">
        <v-card 
          flat 
          class="rounded-t-xl px-6 py-4 border-t-sm bg-blur shadow-up"
          color="primary"
          theme="dark"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex flex-column">
              <span class="text-caption font-weight-bold opacity-70">Est. Monthly</span>
              <span class="text-h6 font-weight-black line-height-1">
                {{ formatCurrency(monthlyTotal) }}
              </span>
            </div>

            <v-btn
              color="white"
              variant="flat"
              rounded="pill"
              class="text-primary font-weight-black px-6"
              size="large"
              @click="$emit('scroll-to-calc')"
            >
              ADJUST
              <v-icon end size="18">mdi-tune-variant</v-icon>
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-slide-y-reverse-transition>
  </v-no-ssr>
</template>

<script setup lang="ts">
/**
 * @file components/mobile-result-bar.vue
 * @description Sticky bottom navigation bar for mobile viewports.
 * Displays calculated monthly obligation when the primary chart is scrolled out of view.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  monthlyTotal: number;
}>();

defineEmits(['scroll-to-calc']);

const { mobile } = useDisplay();
const scrollY = ref(0);

/**
 * Updates internal scroll state for visibility threshold.
 */
const handleScroll = (): void => { 
  scrollY.value = window.scrollY; 
};

/**
 * Threshold logic: Visible on mobile when scrolled > 650px and estimate is valid.
 */
const shouldShow = computed((): boolean => {
  return mobile.value && scrollY.value > 650 && props.monthlyTotal > 0;
});

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(val);
};
</script>

<style scoped>
.mobile-sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}

.bg-blur {
  backdrop-filter: blur(12px);
  will-change: backdrop-filter;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.95), #2563EB) !important;
}

.shadow-up {
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2) !important;
}

.line-height-1 { line-height: 1; }

.border-t-sm {
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>