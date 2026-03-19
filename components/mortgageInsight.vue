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
            <h2 class="text-h3 font-weight-black mb-6 leading-tight">
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
            <v-card flat class="pa-8 bg-primary rounded-xl text-white h-100 d-flex flex-column elevation-10">
              <h3 class="text-h5 font-weight-bold mb-4">Today's Market Pulse</h3>
              <div class="mb-6">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-caption">Avg. 30yr Fixed</span>
                  <span class="text-caption font-weight-black">6.24%</span>
                </div>
                <v-progress-linear model-value="62" color="white" rounded height="6" />
              </div>
              
              <p class="text-body-2 mb-8 opacity-90">
                Rates are shifting daily. Lock in your estimate with a localized ZIP code to 
                ensure your monthly payment calculation is as accurate as possible.
              </p>
              
              <v-spacer />
              
              <v-btn 
                block 
                color="white" 
                size="x-large" 
                variant="flat" 
                class="text-primary text-none font-weight-black rounded-pill hover-lift"
                @click="$emit('find-rates')"
              >
                Find Best Rates in My Area
              </v-btn>
              <!-- Sponsored Section Removed -->
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
/**
 * @file components/mortgageInsight.vue
 * @description Educational content and conversion sidebar for the mortgage calculator.
 */
defineEmits(['find-rates']);
</script>

<style scoped>
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
  filter: grayscale(100%) invert(var(--v-theme-grayscale-invert, 0));
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