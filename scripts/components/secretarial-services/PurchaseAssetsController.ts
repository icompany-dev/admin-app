import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"

export class PurchaseAssetsController extends SecretarialServicesController<CompanyAssetPurchase> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAssetPurchase, useCompanyAssetPurchaseStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAssetPurchase(data)
    this.router.push({ path: `/services/asset-purchase/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyAssetPurchase(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyAssetPurchase(data)
    return `
      ???
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyAssetPurchase(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAssetPurchase(data)
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
    let application = new CompanyAssetPurchase(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.READY:
        return this.language.isMalay() ? "Permohonan Sedia" : "Application Ready"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyAssetPurchase(data)
    return new Company(application.company)
  }
}
