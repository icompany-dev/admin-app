import { useAuthStore } from "~/stores/Auth"
import { useUserStore } from "~/stores/Users"
import { User } from "~/scripts/models/User"

export class CurrentUser {
  static async get(): Promise<User> {
    const auth = useAuthStore()
    const userId: string | null = auth.getUserId

    if (!userId) {
      let route = useRoute()
      if (route.path.startsWith("/public")) {
        return new User()
      }

      auth.logout()
      return new User()
    }

    try {
      const repository = useUserStore()
      let response = await repository.fetch(userId)
      if (repository.error !== null) {
        throw repository.error
      }

      let user = new User(response)

      return user
    } catch (e) {
      auth.logout()
      return new User()
    }
  }

  // NOTE: This value is only as of login.
  static async getFromCookie(): Promise<User> {
    const config = useRuntimeConfig()
    const cookiePrefix = `auth.${config.public.appName}_${config.public.appEnv}_`
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
    }

    const userCookie = useCookie<User | null>(`${cookiePrefix}_user`, cookieOptions)

    const user = ref<User | null>(userCookie.value)
    if (!user.value) {
      return await CurrentUser.get()
    }

    return new User(user.value)
  }
}
