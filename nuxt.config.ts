// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-icon",
    "nuxt-gtag",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs", "skipHydrate"],
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/color-mode",
  ],
  // pinia
  // imports
  imports: {
    // import store from '@/store'
    dirs: ["stores"],
  },

  // colorMdoe
  colorMode: {
    preference: "dark", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
  },

  // google tag
  gtag: {
    id: "",
    initialConsent: true,
  },

  // watchers for dev mode
  webpack: {
    loaders: {
      vue: {
        hotReload: true,
      },
    },
  },

  // api url in runtime
  runtimeConfig: {
    public: {
      apiUrl: "",
      homeUrl: "",
      djangoToken: "",
      sentry: {
        dsn: "",
        environment: "development",
      },
    },
  },

  sourcemap: {
    client: true,
    server: true,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
