import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"

export class ChangeOfDescriptionsController extends SecretarialServicesController<CompanyAmendmentDescription> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAmendmentDescription, useCompanyAmendmentDescriptionStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAmendmentDescription(data)
    this.router.push({ path: `/services/change-business-description/${application.id}` })
  }

  applicationDetails(data: any): string {
    let application = new CompanyAmendmentDescription(data)
    return `
      <b>${this.language.isMalay() ? "Perihal Baharu" : "New Description"}:</b> ${application.businessDescription}<br>
    `
  }

  companyName(data: any): string {
    let application = new CompanyAmendmentDescription(data)
    return this.company(application).getFullName()
  }

  applicationDate(data: any): string {
    let application = new CompanyAmendmentDescription(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAmendmentDescription(data)
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
    let application = new CompanyAmendmentDescription(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Description Rejected"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyAmendmentDescription(data)
    return new Company(application.company)
  }
}
