<template>
  <nav shadow>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      class="pa-4"
      elevation="10"
    >
      <div class="d-flex flex-column ga-4">
        <div class="text-overline mb-2">Navigation</div>
        <v-btn 
          v-for="item in menuItems" 
          :key="item.to"
          variant="text" 
          :to="item.to" 
          :prepend-icon="item.icon"
          block 
          class="justify-start text-none font-weight-bold"
          active-class="text-primary"
          @click="drawer = false"
        >
          {{ item.title }}
        </v-btn>
        
        <v-divider class="my-2" />
        
        <v-btn 
          color="primary" 
          rounded="pill" 
          block 
          class="text-none font-weight-black"
          elevation="0"
          @click="handleGetStarted"
        >
          Get Started
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-app-bar 
      flat 
      class="border-b px-md-8" 
      height="80"
      style="backdrop-filter: blur(10px); background: rgba(var(--v-theme-surface), 0.8) !important;"
    >
      <NuxtLink to="/" class="d-flex align-center me-4">
        <div class="logo-container">
          <!-- Logo Switching Logic -->
          <img src="/logo_light.png" class="logo light-only" alt="Loan Estimate Tool Logo" />
          <img src="/logo_dark.png" class="logo dark-only" alt="Loan Estimate Tool Logo" />
        </div>
      </NuxtLink>

      <v-spacer />

      <div class="hidden-sm-and-down d-flex ga-2 align-center">
        <v-btn 
          v-for="item in menuItems" 
          :key="item.to"
          variant="text" 
          :to="item.to" 
          class="text-none font-weight-bold"
          active-class="text-primary"
        >
          {{ item.title }}
        </v-btn>
      </div>

      <v-spacer />

      <div class="d-flex align-center ga-2">
        <!-- Theme Toggle Slot from Parent -->
        <slot name="theme-toggle"></slot>
        
        <v-btn 
          color="primary" 
          variant="flat" 
          rounded="pill" 
          class="text-none font-weight-black px-6 ms-2 hidden-xs-only"
          @click="handleGetStarted"
        >
          Get Started
        </v-btn>
        
        <v-app-bar-nav-icon 
          class="hidden-md-and-up" 
          aria-label="Open Navigation Menu"
          @click="drawer = !drawer" 
        />
      </div>
    </v-app-bar>
  </nav>
</template>

<script setup lang="ts">
/**
 * @file components/app-nav-bar.vue
 * @description Global navigation with smooth logo switching and CTA event handling.
 */
import { ref } from 'vue';

const drawer = ref(false);

const menuItems = [
  { title: 'Loan Guide', to: '/mortgage-loan-guide', icon: 'mdi-book-open-page-variant' },
  { title: 'Taxes', to: '/guides/property-taxes', icon: 'mdi-home-percent' },
  { title: 'Insurance', to: '/guides/insurance', icon: 'mdi-shield-check' },
  { title: 'PMI', to: '/guides/pmi', icon: 'mdi-cash-lock' },
];

const emit = defineEmits(['get-started']);

/**
 * Closes drawer and notifies parent to trigger the "Get Started" flow (scroll/focus).
 */
const handleGetStarted = () => {
  drawer.value = false;
  emit('get-started');
};
</script>

<style scoped>
.logo-container {
  height: 40px;
  width: 180px;
  position: relative;
}

.logo {
  height: 100%;
  width: auto;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.2s ease-in-out;
}

/* 
  Theme-specific visibility:
  Vuetify applies .v-theme--light or .v-theme--dark to the v-app or body.
*/
:deep(.v-theme--light) .dark-only { opacity: 0; pointer-events: none; }
:deep(.v-theme--dark) .light-only { opacity: 0; pointer-events: none; }

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

/* Hover effect for Nav Links */
.v-btn--variant-text:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>