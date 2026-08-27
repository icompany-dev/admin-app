import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"

export class ChangeOfNamesController extends SecretarialServicesController<CompanyAmendmentName> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAmendmentName, useCompanyAmendmentNameStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAmendmentName(data)
    this.router.push({ path: `/services/change-business-name/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyAmendmentName(data)
    return !StringUtil.isNullOrEmpty(application.currentName)
      ? application.currentName
      : this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyAmendmentName(data)
    return `
      <b>${this.language.isMalay() ? "Cadangan Nama" : "Proposed Name"}:</b> ${application.name1?.getCompleteName()}<br>
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyAmendmentName(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAmendmentName(data)
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
    let application = new CompanyAmendmentName(data)
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
    let application = new CompanyAmendmentName(data)
    return new Company(application.company)
  }
}
