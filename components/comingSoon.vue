<template>
  <v-img class="mx-auto"
         height="80vh"
         :src="smAndDown ? '/coming_soon_m.png' : '/coming_soon.png'" />
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify/lib/composables/display.mjs'

const { smAndDown } = useDisplay()
</script>
