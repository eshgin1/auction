// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['msw', 'msw/browser'],
    },
  },
  typescript: {
    // typeCheck: true,
    tsConfig: {
      vueCompilerOptions: {
        target: 3.3,
      },
    },
  },
})
