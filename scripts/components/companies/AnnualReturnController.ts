import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { StatusConstants } from "~/scripts/constants/Status"
import { AnnualReturnXBRLGenerator } from "~/scripts/library/AnnualReturnXBRLGenerator"
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
import type { ARShareCapital, AnnualReturnData } from "~/scripts/types/AnnualReturnXBRLGenerator"
import type { Secretary } from "~/scripts/types/Secretary"
import { StringUtil } from "~/scripts/utils/String"

export class AnnualReturnController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())
  companyAnnualReturnRequest = ref<CompanyAnnualReturnRequest>(new CompanyAnnualReturnRequest())

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  documentsAndForms = ref<DocumentsAndForms>(new DocumentsAndForms(""))

  isLoading: Ref<boolean> = ref<boolean>(false)
  isGenerating: Ref<boolean> = ref<boolean>(false)

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

  getDateOfAppointment(human: Director | Shareholder): string {
    let time = useLocalTime()
    return time.formatDateOnlyFull(human.dateAppointed ?? "")
  }

  async onGenerateXBRLClicked(): Promise<void> {
    if (this.isGenerating.value) {
      return
    }

    try {
      this.isGenerating.value = true

      let generator = new AnnualReturnXBRLGenerator()
      generator.setAnnualReturnData(this.annualReturnData)

      let xbrlPackage = generator.generateXBRLPackage()
      if (!xbrlPackage) {
        let error = new Error()
        error.type = Error.ERROR_TYPE_DATA
        error.title = this.language.isMalay() ? "Pakej XBRL adalah kosong" : "XBRL Package is Null"
        throw error
      }

      let { zipBlob, sizeBytes } = await generator.createZipBlobFromPackage(
        xbrlPackage.xbrlFilename,
        xbrlPackage.xbrlXml,
        xbrlPackage.manifestXml,
        xbrlPackage.calculationXml
      )
      const blobUrl = window.URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", xbrlPackage.filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      }
    } finally {
      this.isGenerating.value = false
    }
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

  get dateAppointed(): string {
    return this.language.isMalay() ? "Tarikh Dilantik" : "Date Appointed"
  }

  get generateXbrlLabel(): string {
    return this.language.isMalay() ? "Jana Pakej XBRL" : "Generate XBRL Package"
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

  get annualReturnData(): AnnualReturnData {
    let dayjs = useDayjs()

    let shareCapital: ARShareCapital[] = [
      {
        shareClass: "Ordinary",
        numberOfShares: this.totalOrdinaryShares,
        amountPaidUp: this.totalOrdinaryShares,
        currency: "MYR",
      },
    ]

    if (this.totalPreferenceShares > 0) {
      shareCapital.push({
        shareClass: "Preference",
        numberOfShares: this.totalPreferenceShares,
        amountPaidUp: this.totalPreferenceShares,
        currency: "MYR",
      })
    }

    return {
      companyName: this.company.value.getFullName().replace("SDN BHD", "SDN. BHD."),
      companyNumber: this.company.value.registrationNumberNew,
      oldCompanyNumber: this.company.value.registrationNumberOld,
      companyType: "Private Limited (Sdn. Bhd.)",
      registeredOfficeAddress: {
        addressLine1: this.registeredAddressLine1,
        addressLine2: this.registeredAddressLine2,
        postcode: this.registeredAddressPostcode,
        city: this.registeredAddressCity,
        state: this.registeredAddressState,
      },
      businessAddress: {
        addressLine1: this.businessAddressLine1,
        addressLine2: this.businessAddressLine2,
        postcode: this.businessAddressPostcode,
        city: this.businessAddressCity,
        state: this.businessAddressState,
      },
      principalActivities: this.businessDescription,
      msicCode: "",
      msicCodes: this.msicCodes.map((m: MsicCode, index: number) => {
        return {
          id: m.code,
          code: m.code,
          description: m.descriptionEn,
          isPrimary: index === 0,
        }
      }),
      annualReturnDate: dayjs(this.annualReturnDate).format("YYYY-MM-DD"),
      financialYearEndDate: "", //to do
      isExemptPrivateCompany: false,
      shareCapital: shareCapital,
      directors: this.directorsForAnnualReturn.map((d: Director) => {
        return {
          id: d.id,
          name: d.user?.name ?? d.name,
          idNumber: d.user?.detail?.identification ?? "",
          residentialAddress: d.user?.detail?.location?.getOnelineAddress() ?? "",
          nationality: d.user?.detail?.citizenship ?? "MALAYSIAN",
          designation: "Director",
          appointmentDate: dayjs(d.dateAppointed).format("YYYY-MM-DD"),
        }
      }),
      secretaries: SecretaryInformation.SECRETARY_NAME_LIST.map((s: Secretary) => {
        return {
          id: "",
          name: s.name,
          idNumber: s.nric,
          licenseNumber: s.license,
          registeredAddress: this.company.value.registeredAddressLocation?.getOnelineAddress() ?? "",
          appointmentDate: dayjs().format("YYYY-MM-DD"),
        }
      }),
      auditor: {
        firmName: "",
        firmNumber: "",
        firmAddress: "",
        appointmentDate: "",
      },
      shareholders: this.shareholders.value.map((s: Shareholder) => {
        return {
          id: s.id,
          name: s.fullName(),
          idOrRegNumber: s.identification,
          address: s.getAddress().replaceAll("<br>", ", "),
          nationalityOrCountry: s.isCorporateRepresentative() ? "" : (s.user?.detail?.citizenship ?? ""),
          shareClass: s.ordinaryShares > 0 ? "Ordinary" : "Preference",
          numberOfShares: s.ordinaryShares,
          percentage: s.percentageShares,
        }
      }),
      indebtedness: {
        hasCharges: false,
        totalAmountSecured: 0,
      },
    }
  }
}
