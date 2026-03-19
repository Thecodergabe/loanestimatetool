<template>
  <v-footer 
    class="py-10 border-t border-white-opacity-10"
    :class="$vuetify.theme.current.dark ? 'bg-grey-darken-4' : 'bg-grey-lighten-4'"
  >
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="me-2">mdi-calculator</v-icon>
            <span class="text-h6 font-weight-black">LoanEstimateTool</span>
          </div>
          <p class="text-caption text-medium-emphasis">
            The world's most precise 2026 mortgage calculator. Providing real-time 
            localized estimates for taxes, insurance, and monthly obligations.
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-center">
          <div class="text-caption font-weight-bold text-uppercase mb-2 text-medium-emphasis">
            Developed & Maintained By
          </div>
          <a 
            href="https://thecodergabe.com" 
            target="_blank" 
            class="studio-link text-decoration-none d-block mb-3"
          >
            <span class="text-subtitle-1 font-weight-black text-primary">thecodergabe</span>
            <span class="text-subtitle-1 font-weight-light text-medium-emphasis"> studio</span>
          </a>
          <div class="d-flex justify-center gap-x-4">
            <v-btn
              icon="mdi-linkedin"
              variant="tonal"
              color="primary"
              size="x-small"
              href="https://linkedin.com/in/thecodergabe"
            />
            <v-btn
              icon="mdi-github"
              variant="tonal"
              color="primary"
              size="x-small"
              href="https://github.com/thecodergabe"
            />
          </div>
        </v-col>

        <v-col cols="12" md="4" class="text-md-end">
          <div class="text-caption text-medium-emphasis">
            © 2026 thecodergabe studio. All rights reserved.
          </div>
          <div class="text-caption text-grey-darken-1">
            Estimates are for educational purposes only.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.border-white-opacity-10 {
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.studio-link:hover span {
  filter: brightness(1.2);
}

.gap-x-4 {
  column-gap: 16px;
}
</style>