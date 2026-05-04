import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useCookie, useNuxtApp, navigateTo } from "#app"
import { User } from "~/scripts/models/User"

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const cookiePrefix = `auth.${config.public.appName}_${config.public.appEnv}_`
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax" as const,
    path: "/", // CRITICAL for S3/Cloudflare sub-routes
    secure: true, // Always true for Cloudflare HTTPS
  }

  const tokenCookie = useCookie<string | null>(`${cookiePrefix}_token`, cookieOptions)
  const userCookie = useCookie<User | null>(`${cookiePrefix}_user`, cookieOptions)
  const userIdCookie = useCookie<string | null>(`${cookiePrefix}_userId`, cookieOptions)
  const ipCookie = useCookie<string | null>(`${cookiePrefix}_ip`, cookieOptions)

  const authToken = ref<string | null>(tokenCookie.value)
  const user = ref<User | null>(userCookie.value)
  const userId = ref<string | null>(userIdCookie.value)
  const userIp = ref<string | null>(ipCookie.value)

  const isLoggedIn = computed(() => !!authToken.value && !!userId.value)
  const getToken = computed(() => authToken.value)
  const getUser = computed(() => user.value)
  const getUserId = computed(() => userId.value)

  // Actions
  async function login(credentials: { email: string; password: string }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { $repositories, $iziToast } = useNuxtApp()

    try {
      setIpAddress()
      const response: any = await $repositories.auth.login(credentials.email, credentials.password)

      let userData = new User(response.data)
      if (!userData.isAdmin()) {
        $iziToast.error({
          title: "You are not authorised.",
          message: "Contact your System Administrator to get access.",
          icon: "lock-key",
          iconColor: "transparent",
          position: "bottomRight",
          pauseOnHover: true,
          close: false,
          timeout: 5000,
        })
        return false
      }

      authToken.value = response.data.token
      user.value = new User(response.data)
      userId.value = response.data.id

      tokenCookie.value = response.data.token
      userCookie.value = new User(response.data)
      userIdCookie.value = response.data.id

      error.value = null

      return true
    } catch (e: any) {
      authToken.value = null
      user.value = null
      userId.value = null
      tokenCookie.value = null
      userCookie.value = null
      userIdCookie.value = null

      error.value = e.response?.data?.message || "Login failed. Please check your credentials."

      $iziToast.error({
        title: "Check Your Email or Password",
        message: "Click 'Forget Password' to reset your password.",
        icon: "lock-key",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      const { $repositories } = useNuxtApp()
      $repositories.auth.logout()
      authToken.value = null
      user.value = null
      userId.value = null
      userIp.value = null

      //Remove cookie
      tokenCookie.value = null
      userCookie.value = null
      ipCookie.value = null

      const cookie = useCookie<string | null>("bank_application_purged_seen")
      cookie.value = null

      navigateTo("/login")
    } catch (e) {
      authToken.value = null
      user.value = null
      userId.value = null
      tokenCookie.value = null
      userCookie.value = null
      userIdCookie.value = null

      const cookie = useCookie<string | null>("bank_application_purged_seen")
      cookie.value = null
      navigateTo("/login")
    }
  }

  async function register(credentials: {
    email: string
    password: string
    passwordConfirmation: string
  }): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { $repositories, $iziToast } = useNuxtApp()

    try {
      const response: any = await $repositories.auth.register(
        credentials.email,
        credentials.password,
        credentials.passwordConfirmation
      )

      authToken.value = response.data.token
      user.value = new User(response.data)
      userId.value = response.data.id

      tokenCookie.value = response.data.token
      userCookie.value = new User(response.data)
      userIdCookie.value = response.data.id

      error.value = null

      return true
    } catch (e: any) {
      authToken.value = null
      user.value = null
      userId.value = null
      tokenCookie.value = null
      userCookie.value = null
      userIdCookie.value = null

      error.value = e.response?.data?.message || "Register failed. Please check your email and passwords."

      $iziToast.error({
        title: "Check Your Email or Password",
        message: "Please make sure that the email is in the correct form.",
        icon: "lock-key",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function forgotPassword(email: string, redirectUrl: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { $repositories, $iziToast } = useNuxtApp()

    try {
      await $repositories.auth.forgotPassword(email, redirectUrl)
      $iziToast.success({
        title: "Check Your Registered Email",
        message: "A link to reset your password has been sent to your email.",
        icon: "success",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || "Unable to send reset link. Please try again."
      $iziToast.error({
        title: "Unable to Send Reset Link",
        message: error.value ?? "",
        icon: "error",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(
    resetPasswordId: string,
    password: string,
    passwordConfirmation: string
  ): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { $repositories, $iziToast } = useNuxtApp()

    try {
      await $repositories.auth.resetPassword(resetPasswordId, password, passwordConfirmation)
      $iziToast.success({
        title: "Your Password has been reset successfully.",
        message: "Please log in.",
        icon: "success",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return true
    } catch (e: any) {
      error.value = e.response?.data?.message || "Unable to reset password. Please try again."
      $iziToast.error({
        title: "Unable to Reset Password",
        message: error.value ?? "",
        icon: "error",
        iconColor: "transparent",
        position: "bottomRight",
        pauseOnHover: true,
        close: false,
        timeout: 5000,
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function setIpAddress(): Promise<void> {
    const providers = ["https://api64.ipify.org?format=json", "https://ipapi.co/json/", "https://ifconfig.me/all.json"]

    for (const url of providers) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2500)

        const response = await fetch(url, { signal: controller.signal })
        const data = await response.json()
        clearTimeout(timeoutId)

        const detectedIp = data.ip || data.ip_addr || data.query

        if (detectedIp) {
          userIp.value = detectedIp
          ipCookie.value = detectedIp
          return
        }
      } catch (e) {
        console.warn(`AuthStore: IP provider ${url} failed or timed out. Trying next...`)
      }
    }
  }

  // Action to check login status on app load or navigation (optional, often handled by middleware)
  function initializeAuthFromCookies() {
    authToken.value = tokenCookie.value
    user.value = userCookie.value
    userId.value = userIdCookie.value
  }

  return {
    user,
    userId,
    authToken,
    userIp,
    tokenCookie,
    userCookie,
    userIdCookie,
    ipCookie,
    isLoading,
    error,
    isLoggedIn,
    getToken,
    getUser,
    getUserId,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    initializeAuthFromCookies,
  }
})
