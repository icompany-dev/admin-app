import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import type { CompanyDocumentRequestItem } from "~/scripts/models/CompanyDocumentRequestItem"

export class DocumentRequestsController extends SecretarialServicesController<CompanyDocumentRequest> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyDocumentRequest, useCompanyDocumentRequestStore(), emitEvents)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyDocumentRequest(data)
    this.router.push({ path: `/services/appoint-director-new/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyDocumentRequest(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyDocumentRequest(data)

    let documents = application.items
      .map((item: CompanyDocumentRequestItem) => {
        return `<li>${item.documentName}</li>`
      })
      .join("")

    return `
      <b>${this.language.isMalay() ? "Dokumen yang Diminta" : "Documents Requested"}</b>
      <ul>
        ${documents}
      </ul>
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyDocumentRequest(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyDocumentRequest(data)
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
    let application = new CompanyDocumentRequest(data)
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
    let application = new CompanyDocumentRequest(data)
    return new Company(application.company)
  }
}
