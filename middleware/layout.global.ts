export default defineNuxtRouteMiddleware((to) => {
  const metaPresets = {
    sdnbhd: {
      layout: "sdnbhd",
      pageTransition: {
        name: "fade",
        mode: "out-in",
      },
      layoutTransition: {
        name: "layout-change",
        mode: "out-in",
      },
    },
    auth: {
      layout: "auth",
      layoutTransition: {
        name: "layout-fade",
        mode: "out-in",
      },
    },
    default: {
      layout: "default",
      layoutTransition: {
        name: "layout-fade",
        mode: "out-in",
      },
    },
    public: {
      layout: "public",
      layoutTransition: {
        name: "layout-fade",
        mode: "out-in",
      },
    },
  }

  const path = to.path
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
  const isAuthRoute = authRoutes.some((route) => {
    return path === route || path === route + "/" || path.startsWith(route + "/")
  })

  if (isAuthRoute) {
    Object.assign(to.meta, metaPresets.auth)
  } else if (path.startsWith("/public")) {
    Object.assign(to.meta, metaPresets.public)
  } else {
    Object.assign(to.meta, metaPresets.default)
  }
})
