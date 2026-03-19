<template>
  <div class="page-wrapper px-4 px-md-0">
    <v-container style="max-width: 1000px;">
      <v-breadcrumbs 
        :items="breadcrumbItems" 
        class="px-0 mb-6 text-caption text-md-body-2 opacity-70"
      />

      <header class="mb-12">
        <v-chip color="primary" variant="tonal" size="small" class="mb-4 font-weight-black">
          2026 Protection Guide
        </v-chip>
        <h1 class="text-h3 text-md-h2 font-weight-black mb-6 text-gradient lh-tight">
          Homeowners Insurance
        </h1>
        <p class="text-body-1 text-md-h6 text-medium-emphasis font-weight-regular leading-relaxed">
          Hazard insurance isn't just a lender requirement; it is your primary financial 
          defense. In 2026, understanding how "Replacement Cost" differs from "Market Value" 
          can prevent a massive gap in your coverage.
        </p>
      </header>

      <v-row>
        <v-col cols="12" md="9">
          <section id="coverage-types" class="mb-16">
            <h2 class="text-h4 font-weight-bold mb-6">1. Understanding Your Policy (HO-3)</h2>
            <p class="mb-6 text-body-1">
              Most standard mortgages require an HO-3 policy. This covers your dwelling 
              and personal liability, but specifically excludes certain natural disasters 
              unless added as a rider.
            </p>

            <v-card variant="outlined" class="rounded-xl overflow-hidden mb-8 soft-border">
              <v-card-item class="bg-surface-light py-4">
                <v-card-title class="text-subtitle-1 font-weight-black d-flex align-center">
                  <v-icon start icon="mdi-clipboard-list-outline" color="primary" class="mr-2" />
                  Standard Coverage Checklist
                </v-card-title>
              </v-card-item>
              
              <v-divider />

              <v-list class="pa-0 bg-transparent">
                <v-list-item v-for="(item, idx) in insuranceChecklist" :key="idx" class="py-3 px-6">
                  <template #prepend>
                    <v-icon color="primary" icon="mdi-check-circle" size="20" />
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-2">
                    {{ item }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </section>

          <section id="escrow-impact" class="mb-16">
            <h2 class="text-h4 font-weight-bold mb-6">2. Impact on Monthly Payments</h2>
            <p class="text-body-1 mb-6">
              Lenders typically "escrow" your insurance, collecting 1/12th of the annual 
              premium each month. If your insurance provider raises rates, your 
              mortgage payment will increase to cover the shortage.
            </p>
            
            <v-alert
              variant="tonal"
              color="primary"
              class="rounded-xl pa-6"
              icon="mdi-lightbulb-on-outline"
            >
              <div class="text-h6 font-weight-black mb-1">Pro Tip</div>
              <div class="text-body-2 leading-relaxed opacity-90">
                Shop your home insurance every 12 months. Competition in the 2026 
                insurtech market can often save homeowners $300–$600 annually on premiums.
              </div>
            </v-alert>
          </section>

          <v-btn 
            color="primary" 
            size="x-large" 
            rounded="pill" 
            class="text-none font-weight-black px-10 elevation-4"
            @click="triggerGetStarted"
          >
            Estimate My Insurance Cost
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/**
 * @file pages/home-insurance.vue
 * @description SEO pillar for Homeowners Insurance. 
 * Updated to use provide/inject for global scroll triggers.
 */
import { inject } from 'vue';
import { useHead } from 'nuxt/app';
const triggerGetStarted = inject<() => void>('triggerGetStarted');

const breadcrumbItems = [
  { title: 'Home', to: '/' },
  { title: 'Home Insurance', disabled: true }
];

const insuranceChecklist = [
  'Dwelling Coverage (Structure)',
  'Personal Property Protection',
  'Liability & Medical Payments',
  'Loss of Use (Temporary Housing)',
  'Replacement Cost Protection'
];

useHead({
  title: 'Home Insurance Guide 2026 | Mortgage Payment Impact',
  meta: [
    { 
      name: 'description', 
      content: 'Learn how homeowners insurance premiums affect your monthly mortgage and escrow accounts.' 
    }
  ]
});
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), #5CBBF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lh-tight { line-height: 1.2 !important; }
.leading-relaxed { line-height: 1.6; }

.soft-border {
  border: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.bg-surface-light {
  background-color: rgba(var(--v-theme-on-surface), 0.02) !important;
}

section {
  scroll-margin-top: 100px;
}
</style>