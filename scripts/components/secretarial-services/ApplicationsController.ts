import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { Company } from "~/scripts/models/Company"

export class ApplicationsController extends SecretarialServicesController<CompanyBankAccountOpening> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyBankAccountOpening, useCompanyBankAccountOpeningStore(), emitEvents)
  }

  onApplicationClicked(application: any): void {
    //do nothing
  }

  companyName(data: any): string {
    let application = new CompanyBankAccountOpening(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    // Which bank, which branch
    return ``
  }

  applicationDate(data: any): string {
    return ""
  }

  applicationStatusClass(data: any): string {
    return "info"
  }

  applicationStatus(data: any): string {
    let application = new CompanyBankAccountOpening(data)
    return application.status
  }

  company(data: any): Company {
    let application = new CompanyBankAccountOpening(data)
    return new Company(application.company)
  }
}
