<template>
  <v-container fluid
               class="py-16 px-4 d-flex flex-column ga-12">
    <!-- Intro Section -->
    <div class="d-flex flex-column align-center text-center">
      <h1 class="text-h2 font-weight-bold mb-2">
        📍 ZIP-Based Mortgage Estimates That Actually Matter
      </h1>
      <p class="text-body-1 text-grey-darken-1"
         style="max-width: 760px;">
        Your ZIP code influences property taxes, insurance premiums, and loan eligibility. Our calculator reveals the
        numbers that matter most — so you can plan smarter.
      </p>
    </div>

    <!-- Core Factors -->
    <div class="d-flex flex-wrap justify-center gap-8">
      <div class="d-flex flex-column"
           style="min-width: 280px; max-width: 360px;">
        <v-icon color="primary"
                size="36">mdi-home-city</v-icon>
        <h2 class="text-h5 font-weight-medium mt-2 mb-1">Property Taxes</h2>
        <p class="text-body-2 text-grey-darken-1">
          ZIP-level tax rates can vary by thousands. Our data shows you how location affects your annual costs.
        </p>
      </div>

      <div class="d-flex flex-column"
           style="min-width: 280px; max-width: 360px;">
        <v-icon color="teal"
                size="36">mdi-shield-home</v-icon>
        <h2 class="text-h5 font-weight-medium mt-2 mb-1">Insurance Risk</h2>
        <p class="text-body-2 text-grey-darken-1">
          Flood, fire, and wind exposure are ZIP-specific — and directly impact your monthly payment.
        </p>
      </div>

      <div class="d-flex flex-column"
           style="min-width: 280px; max-width: 360px;">
        <v-icon color="deep-purple"
                size="36">mdi-bank-outline</v-icon>
        <h2 class="text-h5 font-weight-medium mt-2 mb-1">Loan Access</h2>
        <p class="text-body-2 text-grey-darken-1">
          FHA, VA, USDA, and jumbo loans vary by ZIP and borrower profile. We highlight eligibility indicators for your
          area.
        </p>
      </div>
    </div>

    <!-- Example ZIPs -->
    <div class="d-flex flex-wrap justify-space-around gap-8">
      <v-card class="pa-4 d-flex flex-column"
              variant="outlined"
              :style="smAndDown ? 'width: 100vw' : 'width: 40vw'">
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-subtitle-1 font-weight-bold">ZIP: 97229 – Portland, OR</h3>
          <v-chip color="info">Moderate Risk</v-chip>
        </div>
        <p class="text-body-2">
          💰 Property Tax: <strong>$6,150/year</strong><br />
          🛡️ Insurance Est: <strong>$1,050/year</strong>
        </p>
      </v-card>

      <v-card class="pa-4 d-flex mt-4 mt-md-0 flex-column"
              variant="outlined"
              :style="smAndDown ? 'width: 100vw' : 'width: 40vw'">
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-subtitle-1 font-weight-bold">ZIP: 30301 – Atlanta, GA</h3>
          <v-chip color="warning">Tornado Zone</v-chip>
        </div>
        <p class="text-body-2">
          💰 Property Tax: <strong>$4,200/year</strong><br />
          🛡️ Insurance Est: <strong>$1,400/year</strong>
        </p>
      </v-card>
    </div>

    <!-- Final CTA -->
    <div class="d-flex flex-column align-center text-center">
      <h2 class="text-h5 font-weight-medium mb-2">🧠 Smarter Mortgage Planning Starts Here</h2>
      <p class="text-body-1 text-grey-darken-1 mb-2"
         style="max-width: 640px;">
        Plug in your ZIP, compare costs, and explore loan opportunities with our instant calculator.
      </p>

      <ScrollToBtn target="#results"
                   behavior="smooth"
                   color="primary"
                   variant="elevated"
                   size="large"
                   btnClass="mt-4 d-none d-md-block">
        Use the Mortgage Calculator
      </ScrollToBtn>

      <p class="text-body-2 mt-6 text-grey-darken-2"
         style="max-width: 600px;">
        📘 Want to dive deeper into FHA, VA, USDA, and jumbo loan types?
        <a href="/loanGuide"
           class="text-decoration-underline font-weight-medium">
          Read our full mortgage guide →
        </a>
      </p>
    </div>
  </v-container>
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
</script>