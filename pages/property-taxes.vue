<template>
  <div class="page-wrapper px-4 px-md-0">
    <v-container class="max-w-1000">
      <v-breadcrumbs
        :items="breadcrumbItems"
        class="px-0 mb-6 text-caption text-md-body-2"
      />

      <header class="mb-12">
        <h1 class="text-h3 text-md-h2 font-weight-black mb-6 text-gradient lh-tight">
          Real Estate & Property Taxes
        </h1>

        <p class="text-body-1 text-md-h6 text-medium-emphasis font-weight-regular leading-relaxed">
          Property taxes are the largest variable in your monthly payment. Unlike your fixed
          interest rate, taxes can change annually based on local assessments.
        </p>
      </header>

      <v-row>
        <v-col cols="12" md="9">
          <section id="tax-math" class="mb-16">
            <h2 class="text-h4 font-weight-bold mb-6">How Your Tax is Calculated</h2>

            <p class="mb-6 text-body-1">
              Most municipalities use a "Millage Rate" system. One mill represents $1
              of tax for every $1,000 of assessed property value.
            </p>

            <v-card variant="outlined" class="rounded-xl overflow-hidden mb-8 soft-border">
              <v-card-item class="bg-surface-light py-4 border-b">
                <v-card-title class="text-subtitle-1 font-weight-black text-center">
                  The Property Tax Formula
                </v-card-title>
              </v-card-item>

              <div class="pa-10 text-center bg-transparent">
                <div class="text-h4 font-weight-black text-primary">
                  (Assessed Value × Millage) / 1,000
                </div>
              </div>
            </v-card>
          </section>

          <v-alert
            variant="tonal"
            color="primary"
            class="rounded-xl pa-6 mb-12"
            icon="mdi-shield-check"
          >
            <div class="text-h6 font-weight-black mb-1">Check for Exemptions</div>
            <div class="text-body-2 leading-relaxed opacity-90">
              Many homeowners qualify for Homestead or Senior exemptions that are not
              automatically applied. Filing can save you thousands annually.
            </div>
          </v-alert>

          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            class="text-none font-weight-black px-10 elevation-4"
            @click="triggerGetStarted"
          >
            Check Local Tax Rates
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/**
 * @file pages/property-taxes.vue
 * @description SEO guide for property taxes. Injects global trigger from app.vue.
 */
import { inject } from 'vue'
import { useHead } from 'nuxt/app'

const triggerGetStarted = inject<() => void>('triggerGetStarted')

const breadcrumbItems = [
  { title: 'Home', to: '/' },
  { title: 'Property Taxes', disabled: true }
]

useHead({
  title: 'Property Tax Guide 2026 | Local Millage & Assessments',
  meta: [
    {
      name: 'description',
      content: 'Understand how local taxes impact your mortgage.'
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

.leading-relaxed {
  line-height: 1.6;
}

.soft-border {
  border: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.bg-surface-light {
  background-color: rgba(var(--v-theme-on-surface), 0.02) !important;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

section {
  scroll-margin-top: 100px;
}
</style>