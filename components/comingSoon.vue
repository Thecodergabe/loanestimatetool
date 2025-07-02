<template>
    <v-img class="mx-auto"
           height="80vh"
           :src="mobile ? '/coming_soon_m.png' : '/coming_soon.png'">
    </v-img>
</template>
<script lang="ts" setup>
import { useDisplay } from 'vuetify/lib/composables/display.mjs';
const { mobile } = toRefs(useDisplay());
</script>