<template>
  <v-app :theme="themeName">
    <NuxtRouteAnnouncer />

    <app-nav-bar @get-started="handleGetStarted">
      <template #theme-toggle>
        <DarkModeToggle 
          v-model="isDark" 
          @update:model-value="updateThemePreference" 
        />
      </template>
    </app-nav-bar>

    <v-main class="bg-dynamic">
      <NuxtPage @update:estimate="(val: number) => currentMonthlyEstimate = val"  />
      <app-footer class="mt-12" />
    </v-main>

    <mobile-result-bar 
      :monthly-total="currentMonthlyEstimate" 
      @scroll-to-calc="handleGetStarted" 
    />
  </v-app>
</template>

<script setup lang="ts">
/**
 * @file app.vue
 * @description Root application component. Orchestrates global state, 
 * theme persistence, and cross-route navigation.
 */
import { ref, computed, onMounted, nextTick, provide } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter, useRoute } from 'vue-router';
import mobileResultBar from './components/mobileResultBar.vue';

const theme = useTheme();
const router = useRouter();
const route = useRoute();

const isDark = ref(false);
const currentMonthlyEstimate = ref(0);

const themeName = computed(() => isDark.value ? 'dark' : 'light');

/**
 * Initializes theme from local storage or system hardware preference.
 */
onMounted(() => {
  const savedTheme = localStorage.getItem('user-preference-theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme(isDark.value ? 'dark' : 'light');
});

/**
 * Updates global theme state and persists selection to local storage.
 * @param {boolean} val - True for dark mode, false for light mode.
 */
const updateThemePreference = (val: boolean): void => {
  isDark.value = val;
  const target = val ? 'dark' : 'light';
  localStorage.setItem('user-preference-theme', target);
  applyTheme(target);
};

/**
 * Updates the Vuetify global theme engine state.
 * Uses a direct value update to sync with the v-app :theme provider.
 * 
 * @param {'light' | 'dark'} targetTheme
 */
const applyTheme = (targetTheme: 'light' | 'dark'): void => {
  if (theme.global.name.value !== targetTheme) {
    theme.global.name.value = targetTheme;
  }
};

/**
 * Handles smooth scroll and component focus for the main CTA.
 * Redirects to index if called from a sub-route.
 */
const handleGetStarted = async (): Promise<void> => {
  if (route.path !== '/') {
    await router.push('/');
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  const el = document.getElementById('calculator-top');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const zipInput = document.querySelector('.zip-input-field input') as HTMLElement;
      zipInput?.focus();
    }, 600);
  }
};

provide('triggerGetStarted', handleGetStarted);
</script>

<style>
.bg-dynamic {
  background-color: v-bind('isDark ? "#0F172A" : "#F8FAFC"') !important;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}
</style>