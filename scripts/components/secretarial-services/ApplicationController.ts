import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"

export class ApplicationController {
  company = ref<Company>(new Company())
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  onCompanyUpdated(company: Company): void {
    this.company.value = new Company(company)

    console.log("yo??", company)
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
}
