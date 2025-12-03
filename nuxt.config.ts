import Aura from '@primeuix/themes/aura'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Roboto',
      }
    ]
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxt/fonts'
  ],

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})