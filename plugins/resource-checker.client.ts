import { ResourceChecker } from "~/scripts/library/ResourceChecker"
import { Toast } from "~/scripts/library/Toast"

export default defineNuxtPlugin((nuxtApp) => {
  const checker = ResourceChecker.getInstance()

  if (typeof window !== "undefined") {
    // 1. Internet Listeners
    window.addEventListener("offline", () => {
      new Toast("You are Offline!", "Please connect to the internet to continue.").warning()
    })

    window.addEventListener("online", () => {
      new Toast("Connection restored", "Please refresh to load the latest updates.").success()
    })

    // 2. Memory Listener
    window.addEventListener("app:memory-low", () => {
      new Toast(
        "Perfomance Remain Limited!",
        "Consider closing unused apps or tabs or check your internet connection."
      ).warning()
    })

    window.addEventListener("app:network-slow", () => {
      new Toast("Unstable Internet Connection!", "Changes may not be saved. Some features may not load.").warning()
    })

    // NOTE: Disabling this until we can handle wise ai and third party rendering
    // window.addEventListener("app:cpu-blocked", () => {
    //   new Toast(
    //     "System Performance Critically Affected",
    //     "Severe network or device limitations are impacting performance. Some features may not function properly."
    //   ).warning()
    // })

    window.addEventListener("app:storage-low", () => {
      new Toast(
        "Performance Slowdown Detected!",
        "You may be experiencing reduced responsiveness. Some actions may be slower."
      ).warning()
    })
  }

  return {
    provide: {
      checker,
    },
  }
})
