// plugins/bootstrap-vue.client.ts
import { createBootstrap } from "bootstrap-vue-next"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createBootstrap({
      components: true,
      plugins: {
        tooltip: true,
      },
    })
  )
})
