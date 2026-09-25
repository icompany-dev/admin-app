import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyTekunApplication } from "~/scripts/models/CompanyTekunApplication"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"

export class TekunApplicationsController extends SecretarialServicesController<CompanyTekunApplication> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyTekunApplication, useCompanyLoanApplicationStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyTekunApplication(data)
    this.router.push({ path: `/services/tekun-applications/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyTekunApplication(data)

    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyTekunApplication(data)
    return `
      //
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyTekunApplication(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyTekunApplication(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return "draft"
      case StatusConstants.PAID:
        return "info"
      case StatusConstants.NAME_REJECTED:
        return "danger"
      case StatusConstants.APPROVED:
        return "success"
    }

    return "info"
  }

  applicationStatus(data: any): string {
    let application = new CompanyTekunApplication(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyTekunApplication(data)
    return new Company(application.company)
  }
}
