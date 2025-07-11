<template>
  <v-container fluid
               class="py-16 px-4 d-flex flex-column ga-12">
    <!-- Header -->
    <section class="d-flex flex-column align-center text-center">
      <h1 class="text-h2 font-weight-bold mb-2">🏡 A Complete Guide to U.S. Mortgage Types</h1>
      <p class="text-body-1 text-grey-darken-1"
         style="max-width: 800px;">
        Whether you're buying your first home or refinancing, the type of loan you choose — and where you live — can
        affect your monthly payment, down payment, and approval process. This guide explores common mortgage types,
        their ZIP-specific implications, and regional benefits you might not know exist.
      </p>
    </section>

    <!-- Loan Type Overview -->
    <section class="d-flex flex-column ga-8">
      <h2 class="text-h4 font-weight-medium">📘 Conventional Loans</h2>
      <p class="text-body-1">
        These loans aren’t backed by any government agency and typically suit borrowers with good credit scores and
        stable income. They're dominant in ZIP codes with high median home prices and established financial footprints.
      </p>
      <v-alert color="info"
               variant="tonal">
        Ideal ZIPs: Suburban neighborhoods with steady appreciation — e.g., 97229 (Portland, OR), 75024 (Plano, TX)
      </v-alert>

      <h2 class="text-h4 font-weight-medium mt-8">🏛️ FHA Loans</h2>
      <p class="text-body-1">
        Backed by the Federal Housing Administration, FHA loans offer lower down payments (as low as 3.5%) and are
        forgiving of moderate credit scores. They’re popular in urban ZIPs with high affordability pressures or where
        first-time buyer programs are common.
      </p>
      <v-alert color="warning"
               variant="outlined">
        Common ZIPs: 30301 (Atlanta, GA), 60644 (Chicago, IL) — often paired with state-level DPA programs.
      </v-alert>

      <h2 class="text-h4 font-weight-medium mt-8">🎖️ VA Loans</h2>
      <p class="text-body-1">
        Exclusively for veterans, VA loans require no down payment, have no PMI, and offer competitive rates. Their
        presence is concentrated in ZIP codes near military installations.
      </p>
      <v-alert color="success"
               variant="tonal">
        ZIP Hotspots: 32544 (Pensacola, FL), 93555 (Ridgecrest, CA) — no-money-down loans with generous underwriting.
      </v-alert>

      <h2 class="text-h4 font-weight-medium mt-8">🌾 USDA Loans</h2>
      <p class="text-body-1">
        USDA loans target rural properties and offer no down payment and subsidized interest. They're hidden gems for
        buyers outside metro areas.
      </p>
      <v-alert color="green-lighten-2"
               variant="outlined">
        Eligibility ZIPs: 97914 (Ontario, OR), 05001 (White River Junction, VT) — check your ZIP’s rural classification
        in our calculator.
      </v-alert>

      <h2 class="text-h4 font-weight-medium mt-8">💼 Jumbo Loans</h2>
      <p class="text-body-1">
        Designed for high-value properties above conventional limits (currently $766,550), jumbo loans are common in
        affluent ZIPs and require strong financial documentation.
      </p>
      <v-alert color="deep-purple"
               variant="tonal">
        High-Value ZIPs: 90210 (Beverly Hills, CA), 10007 (New York, NY) — elite underwriting and reserve requirements
        apply.
      </v-alert>
    </section>

    <!-- Comparison Table -->
    <section class="d-flex flex-column ga-4 mt-12">
      <h2 class="text-h5 font-weight-bold">🔍 Compare Loan Types</h2>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Loan Type</th>
            <th>Down Payment</th>
            <th>Credit Flexibility</th>
            <th>PMI Required</th>
            <th>ZIP Influence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Conventional</td>
            <td>5–20%</td>
            <td>Moderate–Strict</td>
            <td>Yes (if &lt; 20%)</td>
            <td>High-income ZIPs</td>
          </tr>
          <tr>
            <td>FHA</td>
            <td>3.5%</td>
            <td>Lenient</td>
            <td>Yes</td>
            <td>Affordable ZIPs</td>
          </tr>
          <tr>
            <td>VA</td>
            <td>$0</td>
            <td>Flexible</td>
            <td>No</td>
            <td>Military ZIPs</td>
          </tr>
          <tr>
            <td>USDA</td>
            <td>$0</td>
            <td>Flexible</td>
            <td>Yes</td>
            <td>Rural ZIPs</td>
          </tr>
          <tr>
            <td>Jumbo</td>
            <td>10–30%</td>
            <td>Strict</td>
            <td>No</td>
            <td>Affluent ZIPs</td>
          </tr>
        </tbody>
      </v-table>
    </section>
    <section class="d-flex flex-column align-center text-center mt-16">
      <h3 class="text-h5 font-weight-medium mb-2">🔗 Use Our Calculator to Test ZIP Eligibility</h3>
      <p class="text-body-1 text-grey-darken-1 mb-4"
         style="max-width: 640px;">
        Our ZIP-level tool estimates property taxes, insurance, and flags ZIPs eligible for USDA, FHA, and other
        loan types. It’s the fastest way to understand your local mortgage landscape.
      </p>
      <v-btn color="primary"
             size="large"
             href="/">
        Estimate My Mortgage by ZIP
      </v-btn>
    </section>
  </v-container>
</template>
<script lang="ts" setup>
</script>