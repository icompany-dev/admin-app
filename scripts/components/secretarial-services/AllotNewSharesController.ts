import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"

export class AllotNewSharesController extends SecretarialServicesController<CompanyShareholderAllotment> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyShareholderAllotment, useCompanyShareholderAllotmentStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyShareholderAllotment(data)
    this.router.push({ path: `/services/allotment-of-shares/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyShareholderAllotment(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyShareholderAllotment(data)

    let allotmentDetails = application.details

    let shareType =
      allotmentDetails.typeOfShares === ShareType.Ordinary
        ? this.language.isMalay()
          ? "Biasa"
          : "Ordinary"
        : this.language.isMalay()
          ? "Keutamaan"
          : "Preference"

    let details = `
      <b>${this.language.isMalay() ? "Bil. Saham Diperuntukkan" : "No. of Shares to Issue"}:</b> ${NumberUtil.thousandSeparator(allotmentDetails.numberOfShares)}<br>
      <b>${this.language.isMalay() ? "Jenis Saham" : "Type of Shares"}:</b> ${shareType}<br>
      <b>${this.language.isMalay() ? "Cadangan Jumlah Amaun Langganan" : "Proposed Total Subscription Amount"}:</b> RM${NumberUtil.currency(allotmentDetails.proposedTotalSubscriptionAmount)}
    `
    return details
  }

  applicationDate(data: any): string {
    let application = new CompanyShareholderAllotment(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyShareholderAllotment(data)
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
    let application = new CompanyShareholderAllotment(data)
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
    let application = new CompanyShareholderAllotment(data)
    return new Company(application.company)
  }
}
