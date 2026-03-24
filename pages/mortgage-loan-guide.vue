<template>
  <div class="page-wrapper px-4 px-md-0">
    <v-container class="max-w-1000">
      <v-breadcrumbs
        :items="breadcrumbItems"
        class="px-0 mb-6 text-caption text-md-body-2"
      />

      <section id="loan-basics" class="mb-16">
        <h1 class="text-h3 text-md-h2 font-weight-black mb-6 text-gradient lh-tight">
          Mortgage Loan Guide
        </h1>

        <p class="text-body-1 mb-6">
          Understanding the lifecycle of a mortgage loan is essential for long-term
          financial health. This guide covers the fundamentals of loan types and closing costs.
        </p>
      </section>

      <v-row>
        <v-col cols="12" md="9">
          <section id="closing-costs" class="mb-16">
            <h2 class="text-h4 font-weight-bold mb-6">Common Closing Costs</h2>

            <v-card variant="outlined" class="rounded-xl overflow-hidden mb-8 soft-border">
              <v-list class="pa-0 bg-transparent">
                <v-list-item
                  v-for="item in closingItems"
                  :key="item"
                  class="py-3"
                >
                  <template #prepend>
                    <v-icon
                      color="primary"
                      icon="mdi-check-circle-outline"
                      size="22"
                    />
                  </template>

                  <v-list-item-title class="font-weight-medium text-body-2">
                    {{ item }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </section>

          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="text-none font-weight-black px-8"
            @click="triggerGetStarted"
          >
            Start Your Estimate
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/**
 * @file pages/mortgage-loan-guide.vue
 * @description Master guide for loan types and closing costs.
 */
import { inject } from 'vue'
import { useHead } from 'nuxt/app'

const triggerGetStarted = inject<() => void>('triggerGetStarted')

const breadcrumbItems = [
  { title: 'Home', to: '/' },
  { title: 'Loan Guide', disabled: true }
]

const closingItems = [
  'Loan Origination Fees',
  'Home Appraisal & Inspection',
  'Title Insurance & Search',
  'Government Recording Fees',
  'Prepaid Interest & Escrow'
]

useHead({
  title: 'Mortgage Loan Guide | Closing Costs & Requirements',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive guide to mortgage loans.'
    }
  ]
})
</script>

<style scoped>
.max-w-1000 {
  max-width: 1000px;
}

.text-gradient {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), #5CBBF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lh-tight {
  line-height: 1.2 !important;
}

.soft-border {
  border: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

section {
  scroll-margin-top: 100px;
}
</style>