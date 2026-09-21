import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"

export class ChangeOfAddressesController extends SecretarialServicesController<CompanyAmendmentAddress> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAmendmentAddress, useCompanyAmendmentAddressStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAmendmentAddress(data)
    this.router.push({ path: `/services/change-business-address/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyAmendmentAddress(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyAmendmentAddress(data)

    return application.businessAddressLocation.getMultilineAddress()
  }

  applicationDate(data: any): string {
    let application = new CompanyAmendmentAddress(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAmendmentAddress(data)
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
    let application = new CompanyAmendmentAddress(data)
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
    let application = new CompanyAmendmentAddress(data)
    return new Company(application.company)
  }
}
