<template>
  <div class="page-wrapper">
    <LoanEstimatorContainer 
      ref="estimator" 
      @update:monthly-total="val => $emit('update:estimate', val)"
    />
    
    <v-spacer class="my-8" />
    <MortgageInsight @find-rates="handleFindRates" />
  </div>
</template>

<script lang="ts" setup>
// Define the emit so NuxtPage can pass it up to app.vue
defineEmits(['update:estimate']);

import { ref } from 'vue';
import MortgageInsight from '~/components/mortgageInsight.vue';
import LoanEstimatorContainer from '~/components/loanEstimatorContainer.vue';

const estimator = ref(null);

const handleFindRates = () => {
  if (estimator.value) {
    estimator.value.triggerZipFocus();
  }
};
</script>