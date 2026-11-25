import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import type { CompanyDocumentRequestItem } from "~/scripts/models/CompanyDocumentRequestItem"
import { StringUtil } from "~/scripts/utils/String"
import { Filter } from "~/scripts/library/Filter"

export class DocumentRequestsController extends SecretarialServicesController<CompanyDocumentRequest> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyDocumentRequest, useCompanyDocumentRequestStore(), emitEvents)
  }

  override async init(): Promise<void> {
    if (!this.tableDataFetcher.value) {
      return
    }

    this.tableDataFetcher.value.filter = this.filter
    await this.tableDataFetcher.value.fetchData()

    let data = this.tableDataFetcher.value.data
      .map((d: any) => {
        return new CompanyDocumentRequest(d)
      })
      .filter((d: CompanyDocumentRequest) => {
        let isRequestCorporateProfileWithCtc =
          d.items.some((cdi: CompanyDocumentRequestItem) => {
            return StringUtil.contains(cdi.documentName, "corporate profile")
          }) && d.isCtcRequired

        let isNotRequestingCorporateProfile = d.items.every((cdi: CompanyDocumentRequestItem) => {
          return !StringUtil.contains(cdi.documentName, "corporate profile")
        })

        if (!this.isShowCustomReso.value) {
          return isRequestCorporateProfileWithCtc || isNotRequestingCorporateProfile
        }

        let isRequestingCustomResolution = d.items.some((cdi: CompanyDocumentRequestItem) => {
          return StringUtil.contains(cdi.documentName, "custom resolution")
        })

        if (this.isShowPaidOnly.value) {
          return (
            (d.status !== StatusConstants.DRAFT &&
              d.status !== StatusConstants.PENDING &&
              (isRequestCorporateProfileWithCtc || isNotRequestingCorporateProfile)) ||
            isRequestingCustomResolution
          )
        }

        return true
      })

    this.tableDataFetcher.value.data = data
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyDocumentRequest(data)
    this.router.push({ path: `/services/document-requests/${application.id}` })
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

    let content = `
      <b>${this.language.isMalay() ? "Dokumen yang Diminta" : "Documents Requested"}</b>
      <ul>
        ${documents}
      </ul>
    `

    if (this.isCtcByCosecRequired(data) && this.isCtcBySSMRequired(data)) {
      content = `${content}<b>Requested CTC By Cosec & SSM</b>`
    } else if (this.isCtcByCosecRequired(data)) {
      content = `${content}<b>Requested CTC By Cosec</b>`
    } else if (this.isCtcBySSMRequired(data)) {
      content = `${content}<b>Requested CTC By SSM</b>`
    }

    return content
  }

  isCtcByCosecRequired(data: any): boolean {
    let application = new CompanyDocumentRequest(data)

    return application.isCtcRequired
  }

  isCtcBySSMRequired(data: any): boolean {
    let application = new CompanyDocumentRequest(data)

    return application.isSsmCtcRequired
  }

  applicationDate(data: any): string {
    let application = new CompanyDocumentRequest(data)
    if (!application.paidAt) {
      let isRequestingCustomResolution = application.items.some((cdri: CompanyDocumentRequestItem) => {
        return StringUtil.contains(cdri.documentName, "custom resolution")
      })

      if (isRequestingCustomResolution) {
        let requestdate = this.time.formatDateTimeFull(application.createdAt ?? "")
        return this.language.isMalay() ? `Dimohon pada ${requestdate}` : `Requested at ${requestdate}`
      }

      return this.language.isMalay() ? "Belum Dibayar" : "Pending Payment"
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

  override onCreateClicked(): void {
    if (this.createDocumentRequestRef) {
      this.createDocumentRequestRef.show()
    }
  }

  override get filter(): Filter {
    let filter = new Filter()
    filter.take = 20
    filter.takeAll = this.isShowCustomReso.value
    filter.sortOrder = "desc"
    filter.orderBy = "created_at"
    filter.includeTestAccount = this.isIncludeDemo.value
    filter.statuses = [
      StatusConstants.READY,
      StatusConstants.PAID,
      StatusConstants.CONFIRMED,
      StatusConstants.NAME_REJECTED,
      StatusConstants.STAMPING,
      StatusConstants.SHIPPED,
      StatusConstants.APPROVED,
      StatusConstants.REJECTED,
      StatusConstants.SUBMITTED,
      StatusConstants.COMPLETED,
      StatusConstants.CANCELLED,
    ]

    if (!this.isShowPaidOnly.value || this.isShowCustomReso.value) {
      filter.statuses.push(StatusConstants.DRAFT)
      filter.statuses.push(StatusConstants.PENDING)
    }

    if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
      filter.searchText = this.searchText.value
    }

    return filter
  }
}
