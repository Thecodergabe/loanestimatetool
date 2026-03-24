<template>
  <div class="page-wrapper px-4 px-md-0">
    <loan-estimator-container
      ref="estimator"
      @update:monthly-total="(val: string) => $emit('update:estimate', val)"
    />

    <v-spacer class="my-8" />

    <mortgage-insight @find-rates="handleFindRates" />
  </div>
</template>

<script lang="ts" setup>
/**
 * @file pages/index.vue
 * @description Entry point. Handles automated focus for arriving visitors.
 */
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from 'nuxt/app'

defineEmits(['update:estimate'])

const route = useRoute()
const estimator = ref<InstanceType<any> | null>(null)

/**
 * If the user arrives with a 'get-started' intent, trigger the input focus.
 */
onMounted(async () => {
  if (route.query.focus === 'true') {
    await nextTick()
    handleFindRates()
  }
})

/**
 * Handles the 'Find Rates' event or global focus trigger.
 */
const handleFindRates = () => {
  estimator.value?.triggerZipFocus?.()
}

useHead({
  title: 'LoanEstimateTool | Precise 2026 Mortgage Planning',
  meta: [
    {
      name: 'description',
      content: 'Professional grade mortgage calculator.'
    }
  ]
})
</script>

<style scoped>
.page-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}
</style>