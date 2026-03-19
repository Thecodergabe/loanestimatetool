<template>
  <v-container class="py-12" style="max-width: 1000px;">
    <v-breadcrumbs 
      :items="[
        { title: 'Home', href: '/' },
        { title: 'Mortgage Loan Guide', disabled: true }
      ]" 
      class="px-0 mb-6"
    />

    <header class="mb-12">
      <h1 class="text-h2 font-weight-black mb-6 text-gradient">
        The Complete 2026 Mortgage Loan Guide
      </h1>
      <p class="text-h6 text-medium-emphasis font-weight-regular leading-relaxed">
        Navigating the housing market requires more than just a good credit score. 
        Whether you are a first-time buyer or a seasoned investor, understanding the 
        mechanics of your loan can save you over <strong>$50,000</strong> in lifetime interest.
      </p>
    </header>

    <v-row>
      <v-col cols="12" md="3" class="d-none d-md-block">
        <div class="position-sticky" style="top: 100px;">
          <div class="text-overline mb-4">On This Page</div>
          <nav class="toc">
            <a href="#loan-types" class="d-block mb-2 text-decoration-none text-body-2">1. Loan Programs</a>
            <a href="#amortization" class="d-block mb-2 text-decoration-none text-body-2">2. How Amortization Works</a>
            <a href="#pmi" class="d-block mb-2 text-decoration-none text-body-2">3. Avoiding PMI</a>
            <a href="#closing-costs" class="d-block mb-2 text-decoration-none text-body-2">4. Closing Costs 101</a>
          </nav>
        </div>
      </v-col>

      <v-col cols="12" md="9">
        
        <section id="loan-types" class="mb-16">
          <h2 class="text-h4 font-weight-bold mb-6">1. Choosing Your Loan Program</h2>
          <p class="mb-6">
            Not all mortgages are created equal. The "right" loan depends on your 
            down payment ability and your long-term residency plans.
          </p>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              title="Conventional Loans (The Gold Standard)"
              text="Best for those with a credit score of 620+. If you put 20% down, you avoid Private Mortgage Insurance (PMI) entirely. Available in fixed-rate (15, 20, 30 years) or adjustable-rate (ARM) options."
            />
            <v-expansion-panel
              title="FHA Loans (The Starter Loan)"
              text="Backed by the Federal Housing Administration. Allows for a down payment as low as 3.5% with a 580 credit score. Note: FHA loans require Mortgage Insurance Premiums (MIP) for the life of the loan if you put down less than 10%."
            />
            <v-expansion-panel
              title="VA Loans (The Benefit for Heroes)"
              text="Reserved for Veterans and active-duty service members. $0 down payment required and no monthly PMI. However, be aware of the 'VA Funding Fee' which is usually rolled into the loan balance."
            />
          </v-expansion-panels>
        </section>

        <section id="amortization" class="mb-16">
          <h2 class="text-h4 font-weight-bold mb-6">2. Understanding Amortization</h2>
          <p class="mb-4">
            Amortization is the process of paying off your debt in regular installments over time. 
            In the early years of your mortgage, a massive percentage of your payment goes 
            toward <strong>interest</strong> rather than principal.
          </p>
          
          <v-alert color="primary" variant="tonal" class="mt-6">
            <strong>Strategy:</strong> Making just one extra principal-only payment per year 
            can shave 7 years off a 30-year mortgage. Use our calculator's export feature 
            to see your payoff date.
          </v-alert>
        </section>

        <section id="pmi" class="mb-16">
          <h2 class="text-h4 font-weight-bold mb-6">3. Private Mortgage Insurance (PMI)</h2>
          <p>
            PMI is a safeguard for the lender, not you. It typically costs between 
            <strong>0.5% and 1.5%</strong> of the entire loan amount annually. Once your 
            home equity reaches 20%, you can request to have PMI removed on conventional 
            loans, instantly lowering your monthly overhead.
          </p>
        </section>

        <section id="closing-costs" class="mb-16">
          <h2 class="text-h4 font-weight-bold mb-6">4. Beyond the Purchase Price</h2>
          <p class="mb-4">
            Expect to pay 2% to 5% of the home's price in closing costs. This includes 
            title insurance, appraisal fees, and credit report fees.
          </p>
          <v-card border flat class="bg-grey-lighten-4 pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-2">Hidden Costs Checklist:</div>
            <v-checkbox-btn label="Title Search & Insurance" model-value="true" readonly />
            <v-checkbox-btn label="Home Inspection (Crucial)" model-value="true" readonly />
            <v-checkbox-btn label="Pest & Radon Testing" model-value="true" readonly />
            <v-checkbox-btn label="Escrow / Prepaid Taxes" model-value="true" readonly />
          </v-card>
        </section>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
/**
 * @file pages/mortgage-loan-guide.vue
 * @description Long-form SEO pillar page. 
 * Targets keywords: "mortgage loan guide 2026", "how amortization works", "FHA vs VA".
 */

useHead({
  title: 'Mortgage Loan Guide 2026 | Understanding Your Monthly Payment',
  meta: [
    { 
      name: 'description', 
      content: 'Complete expert guide on mortgage types, amortization schedules, and how to avoid hidden closing costs. Updated for the 2026 housing market.' 
    },
    { property: 'og:title', content: 'The 2026 Mortgage Loan Guide | TheCoderGabe' },
    { property: 'og:type', content: 'article' }
  ],
  link: [
    { rel: 'canonical', href: 'https://thecodergabe.com/mortgage-loan-guide' }
  ]
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(45deg, #1867C0, #5CBBF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.toc a {
  color: rgba(0, 0, 0, 0.6);
  transition: color 0.2s;
}

.toc a:hover {
  color: #1867C0;
}

.leading-relaxed {
  line-height: 1.8;
}

section {
  scroll-margin-top: 100px;
}
</style>