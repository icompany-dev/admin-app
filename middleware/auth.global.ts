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
  }

  if (!auth.isLoggedIn && !isPublicRoute) {
    return navigateTo("/login")
  }

  if (auth.isLoggedIn && to.path === "/login") {
    return navigateTo("/")
  }
})
