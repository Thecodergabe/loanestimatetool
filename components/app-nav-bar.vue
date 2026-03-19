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

    <div v-if="mdAndUp" class="d-flex align-center">
      <v-btn 
        to="/" 
        variant="text" 
        class="text-none mr-2"
        :color="route.path === '/' ? 'primary' : ''"
      >
        Home
      </v-btn>
      
      <v-menu open-on-hover transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn 
            v-bind="props" 
            variant="text" 
            class="text-none mr-4"
          >
            Guides
            <v-icon end icon="mdi-chevron-down" size="small" />
          </v-btn>
        </template>
        <v-list class="rounded-xl mt-2 soft-border elevation-xl" min-width="200">
          <v-list-item to="/mortgage-loan-guide" title="Loan Guide" prepend-icon="mdi-book-open-variant" />
          <v-list-item to="/home-insurance" title="Insurance" prepend-icon="mdi-shield-home" />
          <v-list-item to="/property-taxes" title="Property Taxes" prepend-icon="mdi-city" />
          <v-list-item to="/mortgage-pmi" title="PMI Guide" prepend-icon="mdi-percent" />
        </v-list>
      </v-menu>

      <v-btn 
        color="primary" 
        variant="flat" 
        rounded="xl" 
        class="text-none font-weight-black px-6"
        :size="display.width.value < 1260 ? 'small' : 'default'"
        @click="$emit('get-started')"
      >
        Get Started
      </v-btn>

      <v-divider vertical inset class="mx-4" />
      
      <slot name="theme-toggle" />
    </div>

    <v-btn
      v-else
      icon="mdi-menu"
      variant="text"
      @click="drawer = !drawer"
    />
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    width="300"
    class="pa-4"
  >
    <div class="d-flex align-center justify-space-between mb-8">
      <span class="text-h6 font-weight-black">Menu</span>
      <slot name="theme-toggle" />
    </div>

    <v-list nav class="pa-0">
      <v-list-item to="/" title="Home" prepend-icon="mdi-home" rounded="lg" />
      
      <v-list-group value="guides">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-book-multiple" title="Guides" rounded="lg" />
        </template>
        <v-list-item to="/mortgage-loan-guide" title="Loan Guide" prepend-icon="mdi-book-open-variant" />
        <v-list-item to="/home-insurance" title="Insurance" prepend-icon="mdi-shield-home" />
        <v-list-item to="/property-taxes" title="Property Taxes" prepend-icon="mdi-city" />
        <v-list-item to="/mortgage-pmi" title="PMI Guide" prepend-icon="mdi-percent" />
      </v-list-group>
    </v-list>

    <template #append>
      <div class="pa-4">
        <v-btn 
          block 
          color="primary" 
          size="large" 
          rounded="xl" 
          class="text-none font-weight-black"
          @click="drawer = false; $emit('get-started')"
        >
          Get Started
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
/**
 * @file components/AppNavBar.vue
 * @description Site navigation with dynamic breakpoint scaling and mobile drawer.
 */
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme, useDisplay } from 'vuetify';

defineEmits(['get-started']);
const route = useRoute();
const theme = useTheme();
const display = useDisplay();

const { mdAndUp } = display;
const drawer = ref(false);

const isDark = computed(() => theme.global.name.value === 'dark');
</script>

<style scoped>
.soft-border {
  border: 1px solid rgba(var(--v-border-color), 0.12) !important;
}
</style>