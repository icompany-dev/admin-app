import { useAuthStore } from "~/stores/Auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  auth.initializeAuthFromCookies()

  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isPublicRoute = publicRoutes.some((route) => {
    return to.path === route || to.path === route + "/" || to.path.startsWith(route + "/")
  })

  if (!auth.isLoggedIn) {
    if (to.path.startsWith("/public")) {
      return
    }

    if (to.path.includes("/receipt/download") && !to.path.startsWith("/public")) {
      let urlSegments = to.path.split("/receipt/download/")
      let id = urlSegments[urlSegments.length - 1]
      // clean up id to handle erroneous urls
      id = id.replaceAll("https://cosec.icompany.my/receipt//", "")
      return navigateTo(`/public/receipt/download/${id}`)
      if (id) {
      }
    }
  }

  if (!auth.isLoggedIn && !isPublicRoute) {
    return navigateTo("/login")
  }

  if (auth.isLoggedIn && to.path === "/login") {
    return navigateTo("/")
  }
})
