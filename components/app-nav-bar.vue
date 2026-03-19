<template>
  <v-app-bar 
    flat 
    class="px-md-12 border-b AppNavBar" 
    :color="isDark ? '#0F172A' : 'white'"
  >
    <v-btn 
      variant="text" 
      class="text-none font-weight-black text-h6" 
      to="/"
      aria-label="LoanEstimateTool Home"
    >
      <v-icon start icon="mdi-calculator-variant" color="primary" />
      LoanEstimate<span class="text-primary">Tool</span>
    </v-btn>

    <v-spacer />

    <div class="hidden-sm-and-down d-flex align-center">
      <v-btn 
        to="/" 
        variant="text" 
        class="text-none mr-2"
        :color="route.path === '/' ? 'primary' : ''"
      >
        Home
      </v-btn>
      
      <v-menu open-on-hover px-4>
        <template #activator="{ props }">
          <v-btn 
            v-bind="props" 
            variant="text" 
            class="text-none mr-4"
            suffix-icon="mdi-chevron-down"
          >
            Guides
          </v-btn>
        </template>
        <v-list class="rounded-lg mt-2 soft-border elevation-xl">
          <v-list-item to="/mortgage-loan-guide" title="Loan Guide" />
          <v-list-item to="/home-insurance" title="Insurance" />
          <v-list-item to="/property-taxes" title="Property Taxes" />
          <v-list-item to="/mortgage-pmi" title="PMI Guide" />
        </v-list>
      </v-menu>

      <v-btn 
        color="primary" 
        variant="flat" 
        rounded="pill" 
        class="text-none font-weight-bold px-6"
        @click="$emit('get-started')"
      >
        Get Started
      </v-btn>

      <v-divider vertical inset class="mx-4" />
      
      <slot name="theme-toggle" />
    </div>

    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list nav>
      <v-list-item to="/" title="Home" prepend-icon="mdi-home" />
      <v-list-item to="/mortgage-loan-guide" title="Loan Guide" prepend-icon="mdi-book-open-variant" />
      <v-list-item to="/home-insurance" title="Insurance" prepend-icon="mdi-shield-home" />
      <v-list-item to="/property-taxes" title="Property Taxes" prepend-icon="mdi-city" />
      <v-list-item to="/mortgage-pmi" title="PMI Guide" prepend-icon="mdi-percent" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
/**
 * @file components/AppNavBar.vue
 * @description Main site navigation with Home link and Guides dropdown.
 */
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

defineEmits(['get-started']);
const route = useRoute();
const theme = useTheme();
const drawer = ref(false);

const isDark = computed(() => theme.global.name.value === 'dark');
</script>

<style scoped>
.soft-border {
  border: 1px solid rgba(var(--v-border-color), 0.08) !important;
}
</style>