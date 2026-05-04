export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("autoresize", {
    mounted(el: HTMLTextAreaElement) {
      if (!(el instanceof HTMLTextAreaElement)) {
        console.warn("v-autoresize used on a non-textarea element")
        return
      }

      const resize = () => {
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
      }

      resize()

      el.addEventListener("input", resize)

      ;(el as any)._autoresizeHandler = resize
    },

    unmounted(el: HTMLTextAreaElement) {
      if ((el as any)._autoresizeHandler) {
        el.removeEventListener("input", (el as any)._autoresizeHandler)
      }
    },
  })
})
