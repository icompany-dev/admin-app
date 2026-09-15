import type { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import { SecretarialServicesController } from "./SecretarialServicesController"
import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { Filter } from "~/scripts/library/Filter"
import { StringUtil } from "~/scripts/utils/String"

export class LodgeAnnualReturnsController extends SecretarialServicesController<CompanyAnnualReturnRequest> {
  constructor(props: PropsSecretarialServices, emitEvents: any | null) {
    super(props, CompanyAnnualReturnRequest, useCompanyAnnualReturnRequestStore(), emitEvents)
  }

  override async init(): Promise<void> {
    if (!this.tableDataFetcher.value) {
      return
    }

    this.tableDataFetcher.value.filter = this.filter
    await this.tableDataFetcher.value.fetchData()

    let promises = this.tableDataFetcher.value.data.map((d: any) => {
      let data = new CompanyAnnualReturnRequest(d)

      let repository = useCompanyStore()

      return repository.fetch(data.companyId).then((c) => {
        d.company = new Company(c)
      })
    })

    await Promise.allSettled(promises)
  }

  onApplicationClicked(data: any): void {
    let application = new CompanyAnnualReturnRequest(data)
    this.router.push({ path: `/services/allotment-of-shares/${application.id}` })
  }

  companyName(data: any): string {
    let application = new CompanyAnnualReturnRequest(data)
    return this.company(application).getFullName()
  }

  applicationDetails(data: any): string {
    let application = new CompanyAnnualReturnRequest(data)

    let time = useLocalTime()
    let dayjs = useDayjs()

    let company = new Company(application.company)

    let incorporatedAt = time.formatDateOnlyFull(company.incorporatedAt ?? "")

    let annualReturnDateString = dayjs(incorporatedAt).year(parseInt(application.year)).format("YYYY-MM-DD")
    let annualReturnDate = time.formatDateOnlyFull(annualReturnDateString)

    let finalDateToLodgeString = dayjs(incorporatedAt)
      .year(parseInt(application.year))
      .add(1, "month")
      .format("YYYY-MM-DD")
    let finalDateToLodge = time.formatDateOnlyFull(finalDateToLodgeString)

    return `
      <b>${this.language.isMalay() ? "Tarikh Diperbadankan" : "Incorporated On"}:</b> ${incorporatedAt}<br>
      <b>${this.language.isMalay() ? "Tarikh Penyata Tahun" : "Annual Return Date"}:</b> ${annualReturnDate}<br>
      <b>${this.language.isMalay() ? "Tarikh Akhir Serah Simpan" : "Lodgement Due Date"}:</b> ${finalDateToLodge}<br>
    `
  }

  applicationDate(data: any): string {
    let application = new CompanyAnnualReturnRequest(data)
    if (!application.paidAt) {
      return this.language.isMalay() ? "Belum Dibayar" : "(Unpaid)"
    }

    return this.time.formatDateTimeFull(application.paidAt)
  }

  applicationStatusClass(data: any): string {
    let application = new CompanyAnnualReturnRequest(data)
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
    let application = new CompanyAnnualReturnRequest(data)
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
    let application = new CompanyAnnualReturnRequest(data)
    return new Company(application.company)
  }

  override get filter(): Filter {
    let filter = new Filter()
    filter.take = 20
    filter.takeAll = false
    filter.sortOrder = "desc"
    filter.orderBy = "paid_at"
    filter.includeTestAccount = this.isIncludeDemo.value
    filter.statuses = [StatusConstants.READY, StatusConstants.PAID, StatusConstants.APPROVED, StatusConstants.REJECTED]

    if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
      filter.searchText = this.searchText.value
    }

    return filter
  }
}
