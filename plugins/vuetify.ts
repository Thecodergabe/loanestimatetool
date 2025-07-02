import { defineNuxtPlugin } from 'nuxt/app';
import { createVuetify } from 'vuetify';
import colors from 'vuetify/util/colors';

import * as components from 'vuetify/components';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({   
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {

          },
          variables: {
          }
        },
      },
    },  

    components,
    ssr: true
  });

  nuxtApp.vueApp.use(vuetify);
});