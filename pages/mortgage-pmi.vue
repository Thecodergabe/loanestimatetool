<template>
  <div class="page-wrapper px-4 px-md-0">
    <v-container class="max-w-1000">
      <v-breadcrumbs
        :items="breadcrumbItems"
        class="px-0 mb-6 text-caption text-md-body-2 font-weight-bold text-uppercase opacity-60"
      />

      <header class="mb-12">
        <h1 class="text-h3 text-md-h2 font-weight-black mb-6 tracking-tight lh-tight">
          Private Mortgage <span class="text-primary">Insurance</span>
        </h1>

        <p class="text-body-1 text-md-h6 text-medium-emphasis leading-relaxed max-width-700">
          PMI is a temporary overhead for down payments under 20%. Learning how to
          remove it early is the most effective way to drop your monthly payment
          without refinancing your interest rate.
        </p>
      </header>

      <v-row>
        <v-col cols="12" md="8">
          <section id="pmi-removal" class="mb-16">
            <h2 class="text-h4 font-weight-black mb-8">Strategic Removal Path</h2>

            <v-card
              variant="flat"
              color="surface"
              border
              rounded="xl"
              class="overflow-hidden mb-10"
            >
              <v-card-item class="bg-grey-darken-4 py-4 px-6 border-b">
                <v-card-title class="text-subtitle-1 font-weight-black text-uppercase tracking-wider">
                  Equity Milestones (LTV)
                </v-card-title>
              </v-card-item>

              <v-list class="pa-0 bg-transparent">
                <v-list-item
                  v-for="step in pmiSteps"
                  :key="step.title"
                  class="py-6 px-6 border-b last-no-border"
                >
                  <template #prepend>
                    <v-avatar color="primary" variant="tonal" size="48" class="me-4">
                      <v-icon :icon="step.icon" size="24" />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 font-weight-black mb-1">
                    {{ step.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle
                    class="text-body-2 text-medium-emphasis opacity-80 leading-relaxed"
                  >
                    {{ step.desc }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>

            <v-btn
              color="primary"
              size="x-large"
              rounded="xl"
              block
              class="text-none font-weight-black elevation-0 py-8"
              @click="triggerGetStarted"
            >
              Calculate My Potential PMI
            </v-btn>
          </section>
        </v-col>

        <v-col cols="12" md="4" class="ps-md-10">
          <v-card variant="outlined" rounded="xl" class="pa-6 border-dashed">
            <div class="text-overline font-weight-black text-primary mb-2">2026 Average</div>
            <div class="text-h4 font-weight-black mb-4">
              $180<span class="text-body-1">/mo</span>
            </div>
            <p class="text-caption text-medium-emphasis">
              Typical PMI cost for a $400k home with 3.5% down. This adds up to $2,160/year
              in non-equity costs.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/**
 * @file pages/mortgage-pmi.vue
 * @description Professional guide for PMI removal strategies.
 */
import { inject } from 'vue'
import { useHead } from 'nuxt/app'

const triggerGetStarted = inject<() => void>('triggerGetStarted')

const breadcrumbItems = [
  { title: 'Home', to: '/' },
  { title: 'PMI Guide', disabled: true }
]

const pmiSteps = [
  {
    title: '80% LTV Request',
    desc: 'The right to request cancellation once your loan balance reaches 80% of the original property value.',
    icon: 'mdi-email-check-outline'
  },
  {
    title: '78% LTV Termination',
    desc: 'Lenders are legally mandated by the Homeowners Protection Act to drop PMI automatically at this threshold.',
    icon: 'mdi-shield-check-outline'
  },
  {
    title: 'Appraisal-Based Exit',
    desc: 'If local home values rise significantly, a new appraisal can prove you have 20% equity ahead of schedule.',
    icon: 'mdi-home-analytics'
  }
]

useHead({
  title: 'PMI Removal Guide 2026 | Lower Your Monthly Payment',
  meta: [
    {
      name: 'description',
      content:
        'Strategic guide to removing Private Mortgage Insurance early and lowering your monthly house payment.'
    }
  ]
})
</script>

<style scoped>
.max-w-1000 {
  max-width: 1000px;
}

.lh-tight {
  line-height: 1.15 !important;
}

.leading-relaxed {
  line-height: 1.7 !important;
}

.tracking-tight {
  letter-spacing: -0.03em;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.max-width-700 {
  max-width: 700px;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.last-no-border:last-child {
  border-bottom: none !important;
}

.border-dashed {
  border: 1px dashed rgba(var(--v-border-color), 0.2) !important;
}

.page-wrapper {
  padding-top: 80px;
  padding-bottom: 80px;
}
</style>