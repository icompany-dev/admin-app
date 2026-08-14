export default defineNuxtPlugin((nuxtApp) => {
  const previousPath = useState<string | null>("previous-path", () => null)

  useRouter().beforeEach((to, from) => {
    previousPath.value = from.fullPath
  })

  return {
    provide: {
      previousPath,
    },
  }
})
