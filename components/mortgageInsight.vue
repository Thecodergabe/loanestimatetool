<template>
  <v-container fluid class="py-16 px-4 bg-transparent">
    <!-- Trust Section -->
    <v-row justify="center" class="mb-12">
      <v-col cols="12" md="10" class="d-flex flex-wrap justify-center ga-8 opacity-60 grayscale theme-aware-grayscale">
        <div class="d-flex align-center ga-2">
          <v-icon size="20">mdi-check-decagram</v-icon>
          <span class="text-caption font-weight-bold uppercase">Real-Time ZIP Data</span>
        </div>
        <div class="d-flex align-center ga-2">
          <v-icon size="20">mdi-shield-lock</v-icon>
          <span class="text-caption font-weight-bold uppercase">SEC-Grade Accuracy</span>
        </div>
        <div class="d-flex align-center ga-2">
          <v-icon size="20">mdi-update</v-icon>
          <span class="text-caption font-weight-bold uppercase">Updated for 2026 Rates</span>
        </div>
      </v-col>
    </v-row>

    <!-- Main Content Cluster -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-row>
          <!-- Primary Educational Pillar -->
          <v-col cols="12" md="7">
            <h2 class="fixed-h3 font-weight-black mb-6 leading-tight">
              Master Your Mortgage <br/>
              <span class="text-primary text-gradient">Before You Sign</span>
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-8 leading-relaxed">
              Navigating the 2026 housing market requires more than a basic estimate. 
              Our localized engine calculates the <strong>exact property tax millage rates</strong> 
              and <strong>insurance premiums</strong> specific to your neighborhood.
            </p>
            
            <v-card variant="outlined" class="pa-6 border-dashed rounded-xl bg-surface-light mb-6">
              <div class="d-flex align-center mb-4">
                <v-avatar color="primary" size="32" class="me-3">
                  <v-icon size="18" color="white">mdi-lightbulb-on</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-bold">Pro-Tip: The 28% Rule</span>
              </div>
              <p class="text-body-2 text-medium-emphasis">
                Lenders typically prefer your total housing payment to be <strong>under 28%</strong> 
                of your gross monthly income. Use our calculator to see if your current price point 
                stays within the "Safe Zone" for major lenders.
              </p>
            </v-card>
          </v-col>

          <!-- The "Money" Sidebar (Conversion) -->
          <v-col cols="12" md="5">
            <v-card
              variant="flat"
              color="surface"
              rounded="xl"
              class="pa-6 border"
            >
              <div class="d-flex align-center mb-4">
                <v-icon color="primary" class="me-2">mdi-chart-timeline-variant</v-icon>
                <span class="text-h6 font-weight-black">Today's Market Pulse</span>
              </div>

              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption text-medium-emphasis">Avg. 30yr Fixed</span>
                <span class="text-subtitle-2 font-weight-bold text-primary">6.24%</span>
              </div>
              
              <v-progress-linear
                model-value="65"
                color="primary"
                height="6"
                rounded
                class="mb-6"
              />

              <p class="text-body-2 text-medium-emphasis mb-8">
                Rates are shifting daily. Lock in your estimate with a 
                localized ZIP code to ensure your monthly payment 
                calculation is as accurate as possible.
              </p>

              <v-btn
                block
                color="primary"
                rounded="xl"
                size="x-large"
                density="comfortable"
                class="text-none font-weight-black text-caption text-sm-body-1"
              >
                Find Best Rates in My Area
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

/**
 * @file components/mortgageInsight.vue
 * @description Educational content and conversion sidebar for the mortgage calculator.
 */
defineEmits(['find-rates']);
</script>

<style scoped>
.fixed-h3 {
  font-size: 2.25rem; /* or whatever you want */
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(45deg, #1976D2, #64B5F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-surface-light {
  background-color: rgba(var(--v-theme-surface), 0.5) !important;
}

.border-dashed {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3) !important;
}

.theme-aware-grayscale {
  filter: grayscale(100%);
  will-change: filter;
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
</style>