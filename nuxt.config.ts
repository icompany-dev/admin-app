// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: "static",
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  build: {
    transpile: ["vue-countup-v3"],
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "nuxt-toast",
    "nuxt-gtag",
    "nuxt-signature-pad",
    "@pinia/nuxt",
    "@bootstrap-vue-next/nuxt",
    "dayjs-nuxt",
  ],

  build: {
    transpile: ["@aws-sdk/client-s3"],
  },

  gtag: {
    id: process.env.GTAG_ID,
    enabled: process.env.TRACK_ANALYTICS === "true",
  },

  i18n: {
    locales: [
      { code: "en", file: "en-US.ts" },
      { code: "bm", file: "bm-MY.ts" },
    ],
    defaultLocale: "en",
    langDir: "locales/",
    strategy: "prefix_and_default",
    vueI18n: "./i18n.config.ts",
  },

  dayjs: {
    plugins: ["relativeTime", "utc", "timezone", "localeData", "advancedFormat"],
    locales: ["en", "ja", "de"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Kuala_Lumpur",
  },

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-32x32.png",
        },
      ],
    },
  },

  css: [
    "~/assets/scss/app.scss",
    // '@fortawesome/fontawesome-free/css/all.css',
    // '@fortawesome/fontawesome-pro/css/all.css',
    "@fortawesome/fontawesome-pro/css/fontawesome.css",
    "@fortawesome/fontawesome-pro/css/light.css",
    "@fortawesome/fontawesome-pro/css/regular.css",
    "@fortawesome/fontawesome-pro/css/solid.css",
    "@fortawesome/fontawesome-pro/css/duotone.css",
    "@fortawesome/fontawesome-pro/css/duotone-light.css",
    "@fortawesome/fontawesome-pro/css/duotone-thin.css",
    "@fortawesome/fontawesome-pro/css/duotone-regular.css",
    "@fortawesome/fontawesome-pro/css/thin.css",
    "@fortawesome/fontawesome-pro/css/brands.css",
  ],

  runtimeConfig: {
    public: {
      appEnv: process.env.APP_ENV || "dev",
      appName: process.env.APP_NAME || "cosec_icompany",
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000/api", // Fallback for safety
      sleekflowApiKey: process.env.SLEEKFLOW_API_KEY || "",
      systemApiKey: process.env.SYSTEM_API_KEY || "",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      openAiApiKey: process.env.OPENAI_API_KEY || "",
      openAiAssistantId: process.env.OPENAI_ASSISTANT_ID || "",
      awsBucket: process.env.AWS_BUCKET || "",
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      awsRegion: process.env.AWS_REGION || "",
      askSairaWorkflowId: process.env.ASK_SAIRA_WORKFLOW_ID || "",
    },
  },

  plugins: ["~/plugins/pdf.client.ts", "~/plugins/openai-agents.ts"],

  router: {
    options: {
      hashMode: false,
    },
  },
})
