import Aura from '@primeuix/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Roboto',
      },
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'nuxt-google-auth',
  ],

  googleAuth: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    autoLoadScript: true,
    promptOneTap: true,
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL,
    },
  },
});
