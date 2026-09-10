import type { User } from "~/scripts/models/User"

export class SdnBhdDashboardController {
  companyId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  setCookie(): void {
    const cookiePrefix = `auth.cosec_icompany_production_`
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
    }

    const cosecTokenCookie = useCookie<string | null>(`${cookiePrefix}_token`, cookieOptions)
    const cosecUserCookie = useCookie<User | null>(`${cookiePrefix}_user`, cookieOptions)
    const cosecUserIdCookie = useCookie<string | null>(`${cookiePrefix}_userId`, cookieOptions)
    const cosecIpCookie = useCookie<string | null>(`${cookiePrefix}_ip`, cookieOptions)

    let auth = useAuthStore()

    cosecTokenCookie.value = auth.tokenCookie
    cosecUserCookie.value = auth.userCookie
    cosecUserIdCookie.value = auth.userIdCookie
    cosecIpCookie.value = auth.ipCookie
  }

  removeCookie(): void {
    const cookiePrefix = `auth.cosec_icompany_production_`
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
    }

    const cosecTokenCookie = useCookie<string | null>(`${cookiePrefix}_token`, cookieOptions)
    const cosecUserCookie = useCookie<User | null>(`${cookiePrefix}_user`, cookieOptions)
    const cosecUserIdCookie = useCookie<string | null>(`${cookiePrefix}_userId`, cookieOptions)
    const cosecIpCookie = useCookie<string | null>(`${cookiePrefix}_ip`, cookieOptions)

    cosecTokenCookie.value = null
    cosecUserCookie.value = null
    cosecUserIdCookie.value = null
    cosecIpCookie.value = null
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId
  }

  get iframeUrl(): string {
    return `https://cosec.icompany.my/sdnbhd/${this.companyId.value}?isAdmin=true`
  }
}
