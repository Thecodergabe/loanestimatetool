<template>
  <v-responsive>
    <v-app class="bg-background">
      <NuxtRouteAnnouncer />
      <v-app-bar elevation="3"
      color="primary"
                 app>
        <v-img :src="isDark ? '/logo_grey.png' : '/logo_light.png'"
               height="85px"
               width="190px"
               max-width="190px"
               alt="Logo for loan estimate tool"
               aria-label="Logo for loan estimate tool" />
        <v-spacer />
        <DarkModeToggle v-model="isDark" />
      </v-app-bar>

      <v-main>
        <v-container>
          <NuxtPage />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDark = ref(false)
</script>
