import { useAuthStore } from "~/stores/Auth"
import { useLanguage } from "~/composables/useLanguage"

export class LogoutButtonController {
  auth: any = useAuthStore()
  language: any = useLanguage()

  constructor() {}

  async onLogoutButtonClicked(): Promise<void> {
    await this.auth.logout()
  }

  getLabel(): string {
    return this.language.isEnglish() ? `Logout` : `Log Keluar`
  }
}
