<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <NuxtRouteAnnouncer />

    <AppNavBar @get-started="handleGetStarted">
      <template #theme-toggle>
        <DarkModeToggle v-model="isDark" />
      </template>
    </AppNavBar>

    <v-main class="bg-slate-50">
      <!-- Pass the update event up from the page/component -->
      <NuxtPage @update:estimate="val => currentMonthlyEstimate = val" />
      <app-footer class="mt-12" />
    </v-main>

    <!-- Global Mobile Bar -->
    <MobileResultBar 
      v-if="currentMonthlyEstimate > 0"
      :monthly-total="currentMonthlyEstimate" 
      @scroll-to-calc="handleGetStarted" 
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter, useRoute } from 'vue-router';

const isDark = ref(false);
const currentMonthlyEstimate = ref(0); // This will be updated by the calculator
const theme = useTheme();
const router = useRouter();
const route = useRoute();

// Sync theme engine
watch(isDark, (val) => {
  theme.global.name.value = val ? 'dark' : 'light';
});

/**
 * Enhanced handleGetStarted logic.
 * Specifically targets the ZIP input after scrolling for maximum engagement.
 */
const handleGetStarted = async () => {
  if (route.path !== '/') {
    await router.push('/');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  const el = document.getElementById('calculator-top');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Focus ZIP field specifically for the "Localization" helper popup
    setTimeout(() => {
      const zipInput = document.querySelector('.zip-input-field input') as HTMLElement;
      zipInput?.focus();
    }, 600);
  }
};
</script>

<style>
/* Smooth transition for the global background */
.bg-slate-50 {
  background-color: v-bind('isDark ? "#0F172A" : "#F8FAFC"') !important;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
  /* Prevent horizontal bounce on mobile */
  overflow-x: hidden;
}
</style>