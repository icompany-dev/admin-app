import { StatusConstants } from "~/scripts/constants/Status"
import { DocumentsAndForms } from "~/scripts/library/DocumentsAndForms"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Company } from "~/scripts/models/Company"
import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { Director } from "~/scripts/models/Director"
import type { MsicCode } from "~/scripts/models/MsicCode"
import type { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"
import { Shareholder } from "~/scripts/models/Shareholder"
import { User } from "~/scripts/models/User"
import { UserDetail } from "~/scripts/models/UserDetail"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { StringUtil } from "~/scripts/utils/String"

export class AnnualReturnController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())
  companyAnnualReturnRequest = ref<CompanyAnnualReturnRequest>(new CompanyAnnualReturnRequest())

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()

  constructor(company: Company, emitEvents: any) {
    this.setCompany(company)
    this.emitEvents = emitEvents
  }

  async setCompany(company: Company): Promise<void> {
    this.company.value = new Company(company)

    if (this.company.value.id !== this.companyId.value) {
      this.companyId.value = this.company.value.id
      this.documentsAndForms.value.companyId = this.companyId.value
      await this.initializeData()
    }
  }

  async initializeData(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.all([
        this.fetchAnnualReturn(),
        this.fetchDirectors(),
        this.fetchShareholders(),
        this.documentsAndForms.value.init(),
      ])

      this.emitEvents("isPaid", this.isPaid)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchAnnualReturn(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyAnnualReturnStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.take = 5
    filter.sortOrder = "desc"
    filter.orderBy = "year"
    let response = await repository.fetchAll(filter)

    if (response.totalRecords <= 0) {
      this.setEmptyApplication()
      return
    }

    let requestsForYear = response.data
      .map((d: any) => {
        return new CompanyAnnualReturnRequest(d)
      })
      .filter((d: CompanyAnnualReturnRequest) => {
        return d.year === this.yearToLodge
      })

    if (requestsForYear.length <= 0) {
      this.setEmptyApplication()
      return
    }

    let paidForYear = requestsForYear.find((d: CompanyAnnualReturnRequest) => {
      return !StringUtil.isNullOrEmpty(d.paidAt)
    })

    if (!paidForYear) {
      this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(requestsForYear[0])
      return
    }

    this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(paidForYear)
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })

    let promises: any[] = []

    this.directors.value.forEach((d: Director) => {
      promises.push(
        d.getRegisteredUser(useUserStore()).then((r) => {
          d.user = new User(r)
        })
      )
    })

    await Promise.all(promises)
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    this.shareholders.value = response.map((d: any) => {
      return new Shareholder(d)
    })

    let promises = this.shareholders.value.map((d: Shareholder) => {
      return d.getRegisteredUser(useUserStore()).then((r) => {
        d.user = new User(r)
      })
    })

    await Promise.all(promises)
  }

  getUserDetailProps(human: Director | Shareholder): PropsUserDetail {
    return new PropsUserDetail(human.user ?? new User(), human.user?.detail ?? new UserDetail())
  }

  setEmptyApplication(): void {
    this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest()
    this.companyAnnualReturnRequest.value.companyId = this.companyId.value
    this.companyAnnualReturnRequest.value.year = this.yearToLodge
  }

  get yearToLodge(): string {
    let dayjs = useDayjs()

    return dayjs().format("YYYY")
  }

  get isPaid(): boolean {
    return (
      this.companyAnnualReturnRequest.value.status !== StatusConstants.DRAFT &&
      this.companyAnnualReturnRequest.value.status !== StatusConstants.PENDING
    )
  }

  get paymentDate(): string {
    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.paidAt)) {
      return this.language.isMalay() ? "Tiada Bayaran Diterima" : "No Payment Received"
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.companyAnnualReturnRequest.value.paidAt ?? "")
  }

  get incorporationDate(): string {
    return this.company.value.incorporatedAt ?? ""
  }

  get annualReturnDate(): string {
    let dayjs = useDayjs()
    let incorporatedAtMonth = dayjs(this.incorporationDate).month()
    let incorporatedAtDate = dayjs(this.incorporationDate).date()
    let annualReturnDateString = `${this.yearToLodge}-${incorporatedAtMonth}-${incorporatedAtDate}`

    return annualReturnDateString
  }

  get formattedAnnualReturn(): string {
    let time = useLocalTime()

    return time.formatDateOnlyFull(this.annualReturnDate)
  }

  get directorsForAnnualReturn(): Director[] {
    let dayjs = useDayjs()

    return this.directors.value
    // return this.directors.value.filter((d: Director) => {
    //   return dayjs(d.dateAppointed).isBefore(dayjs(this.annualReturnDate))
    // })
  }

  get shareholdersForAnnualReturn(): Shareholder[] {
    let dayjs = useDayjs()

    return this.shareholders.value
    // return this.shareholders.value.filter((d: Shareholder) => {
    //   return dayjs(d.dateAppointed).isBefore(dayjs(this.annualReturnDate))
    // })
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving Details"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "untuk Penyata Tahunan" : "For Annual Return"
  }

  get paymentDateLabel(): string {
    return this.language.isMalay() ? "Bayaran diterima" : "Payment Received at"
  }

  get annualReturnLabel(): string {
    return this.language.isMalay() ? "Tarikh Penyata Tahunan" : "Annual Return Date"
  }

  get descriptionLabel(): string {
    return this.language.isMalay() ? "Perihal Perniagaan" : "Business Description"
  }

  get businessAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Perniagaan" : "Business Address"
  }

  get registeredAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Berdaftar" : "Registered Address"
  }

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get totalOrdinarySharesLabel(): string {
    return this.language.isMalay() ? "Biasa" : "Ordinary"
  }

  get totalPreferenceSharesLabel(): string {
    return this.language.isMalay() ? "Keutamaan" : "Preference"
  }

  get directorsLabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get shareholdersLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholders"
  }

  get businessDescription(): string {
    return this.company.value.businessDescription
  }

  get msicCodes(): MsicCode[] {
    return this.company.value.msicCodeAssigns.map((d: MsicCodeAssign) => {
      return d.msicCode
    })
  }

  get businessAddressLine1(): string {
    return this.company.value.businessAddressLocation?.addressLine1?.toUpperCase() ?? ""
  }

  get businessAddressLine2(): string {
    return this.company.value.businessAddressLocation?.addressLine2?.toUpperCase() ?? ""
  }

  get businessAddressLine3(): string {
    return this.company.value.businessAddressLocation?.addressLine3?.toUpperCase() ?? ""
  }

  get businessAddressPostcode(): string {
    return this.company.value.businessAddressLocation?.postcode ?? ""
  }

  get businessAddressCity(): string {
    return this.company.value.businessAddressLocation?.city?.name.toUpperCase() ?? ""
  }

  get businessAddressState(): string {
    return this.company.value.businessAddressLocation?.state?.name.toUpperCase() ?? ""
  }

  get businessAddressCountry(): string {
    return this.company.value.businessAddressLocation?.country?.name.toUpperCase() ?? ""
  }

  get registeredAddressLine1(): string {
    return this.company.value.registeredAddressLocation?.addressLine1?.toUpperCase() ?? ""
  }

  get registeredAddressLine2(): string {
    return this.company.value.registeredAddressLocation?.addressLine2?.toUpperCase() ?? ""
  }

  get registeredAddressLine3(): string {
    return this.company.value.registeredAddressLocation?.addressLine3?.toUpperCase() ?? ""
  }

  get registeredAddressPostcode(): string {
    return this.company.value.registeredAddressLocation?.postcode ?? ""
  }

  get registeredAddressCity(): string {
    return this.company.value.registeredAddressLocation?.city?.name.toUpperCase() ?? ""
  }

  get registeredAddressState(): string {
    return this.company.value.registeredAddressLocation?.state?.name.toUpperCase() ?? ""
  }

  get registeredAddressCountry(): string {
    return this.company.value.registeredAddressLocation?.country?.name.toUpperCase() ?? ""
  }

  get totalOrdinaryShares(): number {
    return this.shareholders.value
      .map((s: Shareholder) => {
        return Number(s.ordinaryShares)
      })
      .reduce((a, b) => {
        return a + b
      }, 0)
  }

  get totalPreferenceShares(): number {
    return this.shareholders.value
      .map((s: Shareholder) => {
        return Number(s.preferenceShares)
      })
      .reduce((a, b) => {
        return a + b
      }, 0)
  }
}
