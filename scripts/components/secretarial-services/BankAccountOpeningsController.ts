import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"

export class BankAccountOpeningsController extends SecretarialServicesController<CompanyBankAccountOpening> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyBankAccountOpening, useCompanyBankAccountOpeningStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyBankAccountOpening(data)
    this.router.push({ path: `/services/open-bank-account/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyBankAccountOpening(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyBankAccountOpening(data)
    return `
      <b>Bank:</b> ${application.bank.nickname}<br>
      <b>${this.language.isMalay() ? "Cawangan" : "Branch"}:</b> ${application.bankBranch.name}
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyBankAccountOpening(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeShort(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyBankAccountOpening(data)
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
    let application = new CompanyBankAccountOpening(data)
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
    let application = new CompanyBankAccountOpening(data)
    return new Company(application.company)
  }
}
