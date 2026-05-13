import { useLanguage } from "~/composables/useLanguage"
import { useRouter } from "vue-router"

export class HomeButtonController {
  language: any = useLanguage()
  router = useRouter()

  constructor() {}

  onHomeButtonClick(): void {
    this.router.push("/")
  }

  getLabel(): string {
    return this.language.isEnglish() ? `Home` : `Home`
  }
}
