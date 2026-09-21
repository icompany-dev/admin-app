import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import { NumberUtil } from "~/scripts/utils/Number"

export class DividendDeclarationsController extends SecretarialServicesController<CompanyDividendDeclaration> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyDividendDeclaration, useCompanyDividendDeclarationStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyDividendDeclaration(data)
    this.router.push({ path: `/services/declare-dividends/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyDividendDeclaration(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyDividendDeclaration(data)

    let fyeDate = StringUtil.isNullOrEmpty(application.financialYearEndDate)
      ? "(Unknown Date)"
      : this.time.formatDateOnlyFull(application.financialYearEndDate)

    let dateOfRegisterOfMembers = StringUtil.isNullOrEmpty(application.dateOfRegisterOfMembers)
      ? "(Unknown Date)"
      : this.time.formatDateOnlyFull(application.dateOfRegisterOfMembers)

    if (this.language.isMalay()) {
      return `
        <b>Jenis:</b> ${application.dividendType === "interim" ? "Interim" : "Final"}<br>
        <b>Jenis Saham:</b> ${application.shareType === "ordinary" ? "Ordinary" : "Preference"}<br>
        <b>Nilai Sesaham:</b> RM${NumberUtil.currency(application.pricePerShare)}<br>
        <b>Jumlah Dividen:</b> RM${NumberUtil.currency(application.amount)}<br>
        <b>Tarikh Akhir Tahun Kewangan:</b> ${fyeDate}<br>
        <b>Bagi Pemegang Saham pada:</b> ${dateOfRegisterOfMembers}<br>
        <b>Tarikh Bayaran:</b> ${this.time.formatDateOnlyFull(application.dividendPaymentDate)}<br>
        <b>Cara Bayaran:</b> ${application.dividendPaymentMethod}<br>
      `
    }

    return `
      <b>Type:</b> ${application.dividendType === "interim" ? "Interim" : "Final"}<br>
      <b>Type of Share:</b> ${application.shareType === "ordinary" ? "Ordinary" : "Preference"}<br>
      <b>Value per Share:</b> RM${NumberUtil.currency(application.pricePerShare)}<br>
      <b>Total Dividend:</b> RM${NumberUtil.currency(application.amount)}<br>
      <b>Financial Year End:</b> ${fyeDate}<br>
      <b>For Members as of:</b> ${dateOfRegisterOfMembers}<br>
      <b>Payment Date:</b> ${this.time.formatDateOnlyFull(application.dividendPaymentDate)}<br>
      <b>Payment Method:</b> ${application.dividendPaymentMethod}<br>
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyDividendDeclaration(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyDividendDeclaration(data)
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
    let application = new CompanyDividendDeclaration(data)
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
    let application = new CompanyDividendDeclaration(data)
    return new Company(application.company)
  }
}
