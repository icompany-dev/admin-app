import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { NumberUtil } from "~/scripts/utils/Number"
import { StringUtil } from "~/scripts/utils/String"

export class PaymentToDirectorsController extends SecretarialServicesController<CompanyDirectorPayment> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyDirectorPayment, useCompanyDirectorPaymentStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyDirectorPayment(data)
    this.router.push({ path: `/services/payment-to-directors/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyDirectorPayment(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyDirectorPayment(data)
    let time = useLocalTime()
    let fye = !StringUtil.isNullOrEmpty(application.financialYearEndDate)
      ? time.formatDateOnlyFull(application.financialYearEndDate ?? "")
      : "-"

    return `
      <b>${this.language.isMalay() ? "Jenis Bayaran" : "Type of Payment"}:</b> ${application.typeOfPayment}<br>
      <b>${this.language.isMalay() ? "Jumlah" : "Amount"}:</b> RM${NumberUtil.currency(application.amount)}<br>
      <b>${this.language.isMalay() ? "Tarikh Akhir Tahun Kewangan" : "Financial Year End"}:</b> ${fye}
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyDirectorPayment(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyDirectorPayment(data)
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
    let application = new CompanyDirectorPayment(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
      case StatusConstants.SUBMITTED:
        return this.language.isMalay() ? "Dihantar ke SSM" : "Submitted to SSM"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyDirectorPayment(data)
    return new Company(application.company)
  }
}
