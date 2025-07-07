<template>
  <v-responsive>
    <v-app class="bg-background">
      <NuxtRouteAnnouncer />
      <v-app-bar flat>
        <v-toolbar-title>Loan Estimate Tool</v-toolbar-title>
        <v-spacer />
        <DarkModeToggle />
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

</script>
