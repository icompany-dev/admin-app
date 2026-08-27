import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"

export class ApplicationController {
  company = ref<Company>(new Company())
  emitEvents: any | null = null

  language = useLanguage()

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  onCompanyUpdated(company: Company): void {
    this.company.value = new Company(company)
  }

  get companyName(): string {
    return this.company.value.getFullName()
  }

  get registrationNumber(): string {
    return `${this.company.value.registrationNumberNew} (${this.company.value.registrationNumberOld})`
  }

  get isLoading(): boolean {
    return StringUtil.isNullOrEmpty(this.company.value.id)
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }
}
