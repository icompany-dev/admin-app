import { ref } from "vue"
import { useAuthStore } from "~/stores/Auth"
import { useUserStore } from "#imports"
import { useRouter } from "vue-router"
import { StringUtil } from "~/scripts/utils/String"

export class LoginFormController {
  email = ref("")
  password = ref("")
  isShowPassword = ref(false)
  isLoading = ref(false)
  authStore = useAuthStore()
  userStore = useUserStore()
  router = useRouter()
  route = useRoute()
  hasLoginError: boolean = false
  isEmailExist = ref<boolean>(false)
  isLoginSuccess = ref<boolean>(false)

  constructor() {}

  onShowPasswordClicked(): void {
    this.isShowPassword.value = !this.isShowPassword.value
  }

  onPasswordInputChanged(): void {
    this.password.value = this.password.value.replaceAll(" ", "")
  }

  async onSubmitClicked(): Promise<void> {
    if (!StringUtil.isEmailAddress(this.email.value)) {
      return
    }

    this.isEmailExist.value = await this.userStore.checkExists(this.email.value)

    if (!this.isEmailExist.value) {
      this.router.push({
        path: "/register",
        query: {
          email: this.email.value,
        },
      })
      return
    }

    if (!StringUtil.isNullOrEmpty(this.password.value)) {
      await this.login()
    }
  }

  async login(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.isLoading.value = true

    try {
      const success = await this.authStore.login({
        email: this.email.value,
        password: this.password.value,
      })

      if (success) {
        const { gtag } = useGtag()
        gtag("event", "login_clicked", {
          app_name: "Cosec - iCompany Malaysia",
          screen_name: "Login",
        })

        this.isLoginSuccess.value = true

        setTimeout(() => {
          // Delay to allow transition finish bofore redirect
          this.router.push("/")
        }, 1000)
      } else {
        this.hasLoginError = true
      }
    } catch (ex: any) {
      console.error(ex)
    } finally {
      this.isLoading.value = false
    }
  }

  onEmailChanged(): void {
    this.isEmailExist.value = false
    this.password.value = ""
  }

  onForgotPasswordClicked(): void {
    const { gtag } = useGtag()
    gtag("event", "forgot_password_clicked", {
      app_name: "Cosec - iCompany Malaysia",
      screen_name: "Login",
    })
    this.router.push("/forgot-password")
  }

  isSubtitleVisible(): boolean {
    return !this.isEmailExist.value
  }

  isButtonVisible(): boolean {
    return !StringUtil.isNullOrEmpty(this.email.value)
  }

  isSubmitDisabled(): boolean {
    return !StringUtil.isEmailAddress(this.email.value)
  }

  // Copywriting
  loginTitle(): string {
    return "Sign in"
  }

  loginSubtitle(): string {
    return "or Sign Up Below"
  }

  emailLabel(): string {
    if (this.isEmailExist.value) {
      return "This Email is Registered"
    }

    return "Your Personal Email Address"
  }

  passwordLabel(): string {
    return "Your Password"
  }

  submitButtonLabel(): string {
    return "Continue"
  }

  forgotPasswordLabel(): string {
    return "Forgot Password"
  }

  passwordIcon(): string {
    return this.isShowPassword.value ? "fa-eye" : "fa-eye-slash"
  }

  postItTitle(): string {
    return "Why Personal Email"
  }

  postItDescription(): string {
    return `<ul>
          <li>
            eKYC & Verification – It must match your personal identity for SSM purposes.
          </li>
          <li>
            Continuity – You remain the same person even if your company or role changes.
          </li>
          <li>
            Accountability – Every decision, signature, or resolution is tied to you, not some unknown.
          </li>
          <li>
            Security – Shared corporate emails (like info@ or admin@) risk unauthorised access.
          </li>
          <li>
            Governance – Under the Companies Act 2016, directors and shareholders act in their personal capacity — and so does your email.
          </li>
          <li>
            Consistency – One verified email lets you manage multiple Sdn Bhd seamlessly across the iCompany ecosystem.
          </li>
        </ul>
        <p>
          Your personal email is your legal identity in iCompany Systems — not just another inbox.
        </p>`
  }
}
