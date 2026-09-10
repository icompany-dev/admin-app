import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import type { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import { NumberUtil } from "~/scripts/utils/Number"

export class TransferOfSharesController extends SecretarialServicesController<CompanyShareholderTransfer> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyShareholderTransfer, useCompanyShareholderTransferStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyShareholderTransfer(data)
    this.router.push({ path: `/services/appoint-director-new/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyShareholderTransfer(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyShareholderTransfer(data)
    let transferDetails: string[] = application.transferDetails.map((td: CompanyShareTransferDetail) => {
      return `
        <div>
          <b>${td.transferFromName.toUpperCase() ?? "Transferor"}</b>
          <i class='fa-solid fa-arrow-right'></i>
          <b>${td.transferToName?.toUpperCase() ?? "Transferee"}</b>
          <br>
          Shares to Transfer: ${NumberUtil.thousandSeparator(td.unitsOfShare)}
        </div>
      `
    })

    return transferDetails.join("<br>")
  }

  applicationDate(data: any): string {
    let application = new CompanyShareholderTransfer(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyShareholderTransfer(data)
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
    let application = new CompanyShareholderTransfer(data)
    switch (application.status) {
      case StatusConstants.DRAFT:
        return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
      case StatusConstants.PAID:
        return this.language.isMalay() ? "Bayaran Diterima" : "Payment Received"
      case StatusConstants.NAME_REJECTED:
        return this.language.isMalay() ? "Cadangan Nama Ditolak" : "Proposed Name Rejected"
      case StatusConstants.SUBMITTED:
        return this.language.isMalay() ? "Dihantar ke SSM" : "Submitted to SSM"
      case StatusConstants.SUBMITTED:
        return this.language.isMalay() ? "Diluluskan" : "Approved"
    }

    return application.status
  }

  company(data: any): Company {
    let application = new CompanyShareholderTransfer(data)
    return new Company(application.company)
  }
}
