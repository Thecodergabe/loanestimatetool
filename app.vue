<template>
    <v-responsive>
    <v-app>
      <NuxtRouteAnnouncer />
      <v-main>
        <v-container>
          <NuxtPage />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup lang="ts">

import { NuxtPage } from '#components';

</script>