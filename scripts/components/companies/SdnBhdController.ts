import { Compliance } from "~/scripts/library/Compliance"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"

export class SdnBhdController {
  company = ref<Company>(new Company())
  compliance = ref<Compliance>(new Compliance(""))

  emitEvents: any | null = null

  isShowAll: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(company: Company, emitEvents: any) {
    this.setCompany(company)

    this.emitEvents = emitEvents
  }

  setCompany(company: Company): void {
    this.company.value = new Company(company)
    this.fetchCompliance()
  }

  onCompanyClicked(): void {
    this.emitEvents("selected")
    this.isShowAll.value = true
  }

  async fetchCompliance(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.company.value.id)) {
      return
    }

    this.compliance.value = new Compliance(this.company.value.id)
    await this.compliance.value.setupAnnualReturn()
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

  get edit(): string {
    return this.language.isMalay() ? "Kemas Kini" : "Edit"
  }

  get strikeOff(): string {
    return this.language.isMalay() ? "Strike Off" : "Strike Off"
  }

  get switchOut(): string {
    return this.language.isMalay() ? "Switch Out" : "Switch Out"
  }

  get hasAnnualReturnDue(): boolean {
    return this.compliance.value.annualReturnYearsToLodge.length > 0
  }

  get annualReturnDueYears(): string {
    if (!this.hasAnnualReturnDue) {
      return ""
    }

    let sortedYears = this.compliance.value.annualReturnYearsToLodge
      .sort((a, b) => {
        return a - b
      })
      .map((year) => {
        return year.toString()
      })

    let years = StringUtil.oxfordJoin("&", sortedYears)

    return this.language.isMalay()
      ? `Penyata Tahunan Perlu Dikemukakan untuk ${years}`
      : `Annual Return Due for ${years}`
  }
}
