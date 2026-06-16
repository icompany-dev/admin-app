import { CompanyConstants } from "~/scripts/constants/Company"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { PropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceWrapper } from "~/scripts/props/PropsServiceWrapper"
import { StringUtil } from "~/scripts/utils/String"

export class SelectedSdnBhdController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowOptions: Ref<boolean> = ref<boolean>(false)
  isShowApplicationDocuments: Ref<boolean> = ref<boolean>(false)

  isBusiness: Ref<boolean> = ref<boolean>(true)
  isDirectors: Ref<boolean> = ref<boolean>(false)
  isDocuments: Ref<boolean> = ref<boolean>(false)
  isShareholders: Ref<boolean> = ref<boolean>(false)
  isAccounting: Ref<boolean> = ref<boolean>(false)

  selectedService: Ref<string> = ref<string>(CompanyConstants.TARGET_AMENDMENT_NAME)

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

  onBusinessClicked(): void {
    this.isBusiness.value = true
    this.isDirectors.value = false
    this.isDocuments.value = false
    this.isShareholders.value = false
    this.isAccounting.value = false
  }

  onDirectorsClicked(): void {
    this.isBusiness.value = false
    this.isDirectors.value = true
    this.isDocuments.value = false
    this.isShareholders.value = false
    this.isAccounting.value = false
  }

  onDocumentsClicked(): void {
    this.isBusiness.value = false
    this.isDirectors.value = false
    this.isDocuments.value = true
    this.isShareholders.value = false
    this.isAccounting.value = false
  }

  onShareholdersClicked(): void {
    this.isBusiness.value = false
    this.isDirectors.value = false
    this.isDocuments.value = false
    this.isShareholders.value = true
    this.isAccounting.value = false
  }

  onAccountingClicked(): void {
    this.isBusiness.value = false
    this.isDirectors.value = false
    this.isDocuments.value = false
    this.isShareholders.value = false
    this.isAccounting.value = true
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

  onApplicationClicked(selectedService: string): void {
    this.selectedService.value = selectedService
    this.isShowApplicationDocuments.value = true
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

  get business(): string {
    return this.language.isMalay() ? "Perniagaan" : "Business"
  }

  get directors(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get documents(): string {
    return this.language.isMalay() ? "Dokumen" : "Documents"
  }

  get shareholders(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholders"
  }

  get accounting(): string {
    return this.language.isMalay() ? "Perakaunan" : "Accounting"
  }

  get applicationProps(): PropsApplication {
    return new PropsApplication(this.companyId.value)
  }

  get serviceWrapperProps(): PropsServiceWrapper {
    let props = new PropsServiceWrapper(this.companyId.value, this.selectedService.value, null, false, false)

    return props
  }
}
