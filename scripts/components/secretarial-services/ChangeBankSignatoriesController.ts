import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import type { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"

export class ChangeBankSignatoriesController extends SecretarialServicesController<CompanyChangeBankSignatory> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyChangeBankSignatory, useCompanyChangeBankSignatoryStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyChangeBankSignatory(data)
    this.router.push({ path: `/services/change-signatories/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyChangeBankSignatory(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyChangeBankSignatory(data)

    let newSignatories = application.signatories.map((s: CompanyBankSignatory) => {
      return `${s.name?.toUpperCase()} ${s.identification}`
    })

    let distinctSignatories = [...new Set(newSignatories)]

    return `
      <b>Bank:</b> ${application.companyBank.bank.name}<br>
      <b>New Signatories:</b> <br>${distinctSignatories.join("<br>")}
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyChangeBankSignatory(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyChangeBankSignatory(data)
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
    let application = new CompanyChangeBankSignatory(data)
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
    let application = new CompanyChangeBankSignatory(data)
    return new Company(application.company)
  }
}
