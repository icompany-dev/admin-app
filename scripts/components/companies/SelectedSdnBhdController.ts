import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"

export class SelectedSdnBhdController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowOptions: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  async setCompanyId(companyId: string): Promise<void> {
    if (this.companyId.value === companyId) {
      return
    }

    this.companyId.value = companyId
    await this.fetchCompany()
  }

  async fetchCompany(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.company.value = new Company()
      return
    }

    try {
      this.isLoading.value = true

      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.company.value = new Company(response)
    } catch (e) {
      this.company.value = new Company()
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  onOptionsClicked(): void {
    this.isShowOptions.value = !this.isShowOptions.value
  }

  onEditClicked(): void {
    //
  }

  onStrikeOffClicked(): void {
    //
  }

  onSwitchOutClicked(): void {
    // initiate switchout process
  }

  get hasCompanyLogo(): boolean {
    return this.company.value.companyLogo !== null && !StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)
  }

  get companyLogo(): string {
    if (!this.company.value.companyLogo || StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)) {
      return "/img/logo/default-logo.png"
    }

    return this.company.value.companyLogo.url
  }

  get more(): string {
    return this.language.isMalay() ? "Lagi" : "More"
  }

  get edit(): string {
    return this.language.isMalay() ? "Kemas Kini" : "Edit"
  }

  get strikeOff(): string {
    return this.language.isMalay() ? "Strike Off" : "Strike Off"
  }

  get switchOut(): string {
    return this.language.isMalay() ? "Switch Out" : "Switch Out"
  }
}
