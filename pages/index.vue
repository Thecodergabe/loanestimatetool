<template>
  <!-- <ComingSoon /> -->
  <LoanEstimatorContainer />
</template>

<script lang="ts" setup>
// import ComingSoon from '../components/comingSoon.vue'
import LoanEstimatorContainer from '../components/loanEstimatorContainer.vue'
import { useSeoMeta } from 'nuxt/app';

useSeoMeta({
  title: 'Loan Estimate Tool',
  description: 'Instant ZIP-level insurance and tax estimates for mortgage planning.',
  ogTitle: 'Loan Estimate Tool',
  ogDescription: 'Get ZIP-specific insurance and tax estimates instantly.',
  ogImage: 'https://yourdomain.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>

<style></style>
