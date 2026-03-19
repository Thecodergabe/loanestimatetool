<template>
  <v-footer 
    class="py-12 border-t"
    :class="$vuetify.theme.current.dark ? 'bg-black border-white-opacity-10' : 'bg-grey-lighten-5 border-black-opacity-05'"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="5" class="mb-10 mb-md-0">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="me-2" size="24">mdi-calculator-variant</v-icon>
            <span class="text-h6 font-weight-black tracking-tight text-uppercase">LoanEstimateTool</span>
          </div>
          <p class="text-body-2 text-medium-emphasis lh-relaxed pe-md-16">
            Engineered for 2026 market conditions. Providing real-time 
            localized estimates for taxes, insurance, and complex mortgage obligations 
            with pinpoint accuracy.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="mb-10 mb-md-0">
          <nav class="d-flex flex-wrap gap-x-6 gap-y-3">
            <NuxtLink to="/property-taxes" class="footer-link">Property Taxes</NuxtLink>
            <NuxtLink to="/home-insurance" class="footer-link">Home Insurance</NuxtLink>
            <NuxtLink to="/mortgage-pmi" class="footer-link">PMI Guide</NuxtLink>
            <NuxtLink to="/mortgage-loan-guide" class="footer-link">Closing Costs</NuxtLink>
          </nav>
        </v-col>

        <v-col cols="12" md="3" class="text-md-end">
          <a 
            href="https://thecodergabe.com" 
            target="_blank" 
            class="studio-signature text-decoration-none d-inline-flex flex-column align-md-end"
          >
            <div class="d-flex align-center mb-1">
              <span class="brand-name">THECODERGABE</span>
              <span class="brand-suffix ml-1">STUDIO</span>
            </div>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <span>Bespoke Digital Craftsmanship</span>
              <v-icon size="10" class="ms-1" color="primary">mdi-arrow-top-right</v-icon>
            </div>
          </a>
          
          <div class="mt-6 text-caption text-grey-darken-2">
            © 2026 thecodergabe studio. Educational use only.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
/* Matching your studio site's borders */
.border-white-opacity-10 {
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* Resource Link Styling */
.footer-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  transition: all 0.2s ease;
}
.footer-link:hover {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

/* Studio Signature Branding - Exact colors from your screenshot */
.studio-signature {
  transition: opacity 0.2s ease;
}
.studio-signature:hover {
  opacity: 0.8;
}

.brand-name {
  color: #FFFFFF !important;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.brand-suffix {
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 300;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

/* Layout Utils */
.lh-relaxed { line-height: 1.7; }
.gap-x-6 { column-gap: 24px; }
.gap-y-3 { row-gap: 12px; }
.tracking-tight { letter-spacing: -0.02em; }
</style>