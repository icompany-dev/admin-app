import { MagicLink } from "~/scripts/models/MagicLink"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StringUtil } from "~/scripts/utils/String"

export class SdnBhdDashboardController {
  currentUser: Ref<User> = ref<User>(new User())
  magicLink: Ref<MagicLink> = ref<MagicLink>(new MagicLink())

  isLoading: Ref<boolean> = ref<boolean>(false)

  companyId: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      this.currentUser.value = await CurrentUser.get()
      await this.fetchMagicLink()
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  setCookie(): void {
    const cookiePrefix = `auth.cosec_icompany_production_`
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
      domain: "cosec.icompany.my",
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

  async fetchMagicLink(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.currentUser.value.id)) {
      return
    }

    let repository = useMagicLinkStore()
    let data = {
      user_id: this.currentUser.value.id,
    }
    let response = await repository.create(data)

    if (response) {
      this.magicLink.value = new MagicLink(response)
    }
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId
  }

  get iframeUrl(): string {
    return `https://cosec.icompany.my/login/${this.magicLink.value.id}?redirect=/sdnbhd/${this.companyId.value}?isAdmin=true`
  }

  get loaderLabel(): string {
    return "Connecting to"
  }

  get loaderSublabel(): string {
    return "Sdn Bhd Dashboard"
  }
}
