import { Company } from "~/scripts/models/Company"

export class SdnBhdController {
  company = ref<Company>(new Company())

  emitEvents: any | null = null

  isShowAll: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(company: Company, emitEvents: any) {
    this.setCompany(company)

    this.emitEvents = emitEvents
  }

  setCompany(company: Company): void {
    this.company.value = new Company(company)
  }

  onCompanyClicked(): void {
    this.emitEvents("selected")
    this.isShowAll.value = true
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
