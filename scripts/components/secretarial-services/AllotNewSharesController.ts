import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { ConsiderationType } from "~/scripts/constants/AllotmentOfShares"

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

    let considerationType =
      allotmentDetails.considerationType === ConsiderationType.FullyPaid
        ? "Bayar Penuh"
        : allotmentDetails.considerationType === ConsiderationType.PartiallyPaid
          ? "Bayar Separa"
          : "Tidak Berbayar / Belum Dibayar"

    if (this.language.isMalay()) {
      return `
        <b>Jumlah Saham:</b> ${NumberUtil.thousandSeparator(allotmentDetails.numberOfShares)}<br>
        <b>Kelas Saham:</b> ${allotmentDetails.typeOfShares === ShareType.Ordinary ? "Ordinary Shares" : "Preference Shares"}<br>
        <b>Harga Sesaham:</b> RM${NumberUtil.currency(allotmentDetails.considerationPerShare)}<br>
        <b>Jumlah Keseluruhan:</b> RM${NumberUtil.currency(allotmentDetails.proposedTotalSubscriptionAmount)}<br>
        <b>Status Bayaran:</b> ${considerationType}<br>
        <b>Jumlah telah Dibayar:</b> RM ${NumberUtil.currency(allotmentDetails.amountPaid ?? "")}
      `
    } else {
      return `
        <b>Number of Shares:</b> ${NumberUtil.thousandSeparator(allotmentDetails.numberOfShares)}<br>
        <b>Class of Shares:</b> ${allotmentDetails.typeOfShares === ShareType.Ordinary ? "Ordinary Shares" : "Preference Shares"}<br>
        <b>Issue Price per Share:</b> RM${NumberUtil.currency(allotmentDetails.considerationPerShare)}<br>
        <b>Total Subscription Amount:</b> RM${NumberUtil.currency(allotmentDetails.proposedTotalSubscriptionAmount)}<br>
        <b>Payment Status:</b> ${considerationType}<br>
        <b>Amount Paid:</b> RM ${NumberUtil.currency(allotmentDetails.amountPaid ?? "")}
    `
    }
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
