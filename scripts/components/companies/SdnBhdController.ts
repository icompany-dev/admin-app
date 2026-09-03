import { Compliance } from "~/scripts/library/Compliance"
import { Company } from "~/scripts/models/Company"
import { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"
import { AnnualReturnRecord } from "~/scripts/types/AnnualReturnRecord"
import { StringUtil } from "~/scripts/utils/String"

export class SdnBhdController {
  company = ref<Company>(new Company())
  compliance = ref<Compliance>(new Compliance(""))

  emitEvents: any | null = null

  isShowAll: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(company: Company, emitEvents: any) {
    this.setCompany(company)

    this.emitEvents = emitEvents
  }

  setCompany(company: Company): void {
    this.company.value = new Company(company)
    this.fetchCompliance()
  }

  onCompanyClicked(): void {
    this.emitEvents("selected")
    this.isShowAll.value = true
  }

  async fetchCompliance(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.company.value.id)) {
      return
    }

    this.compliance.value = new Compliance(this.company.value.id)
    await this.compliance.value.setupAnnualReturn()
  }

  onEditClicked(): void {
    //
  }

  onStrikeOffClicked(): void {
    //
  }

  onSwitchOutClicked(): void {
    // initiate switchout process
  }

  get hasCompanyLogo(): boolean {
    return this.company.value.companyLogo !== null && !StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)
  }

  get companyLogo(): string {
    if (!this.company.value.companyLogo || StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)) {
      return "/img/logo/default-logo.png"
    }

    return this.company.value.companyLogo.url
  }

  get edit(): string {
    return this.language.isMalay() ? "Kemas Kini" : "Edit"
  }

  get strikeOff(): string {
    return this.language.isMalay() ? "Strike Off" : "Strike Off"
  }

  get switchOut(): string {
    return this.language.isMalay() ? "Switch Out" : "Switch Out"
  }

  get hasAnnualReturnDue(): boolean {
    return this.compliance.value.annualReturnYearsToLodge.length > 0
  }

  get annualReturnDueYears(): string {
    if (!this.hasAnnualReturnDue) {
      return ""
    }

    let sortedYears = this.compliance.value.annualReturnYearsToLodge
      .sort((a, b) => {
        return a - b
      })
      .map((year) => {
        return year.toString()
      })

    let years = StringUtil.oxfordJoin("&", sortedYears)

    return this.language.isMalay()
      ? `Penyata Tahunan Perlu Dikemukakan untuk ${years}`
      : `Annual Return Due for ${years}`
  }

  get msicCodes(): string[] {
    return this.company.value.msicCodeAssigns.map((msicCodeAssign: MsicCodeAssign) => {
      return `${msicCodeAssign.msicCode.code} - ${msicCodeAssign.msicCode.descriptionEn}`
    })
  }

  get annualReturnLabel(): string {
    return this.language.isMalay() ? "Penyata Tahunan" : "Annual Return"
  }

  get annualReturns(): AnnualReturnRecord[] {
    let dayjs = useDayjs()
    let time = useLocalTime()

    let currentYear = dayjs().year()

    let incorporatedAt = dayjs(this.company.value.incorporatedAt)

    let firstAnnualReturn = dayjs(incorporatedAt).add(1, "year").year()
    let endYear = Math.max(currentYear, firstAnnualReturn)

    let annualReturns: AnnualReturnRecord[] = []
    for (let annualReturnYear = firstAnnualReturn; annualReturnYear <= endYear; annualReturnYear++) {
      let annualReturnDate = dayjs(incorporatedAt).year(annualReturnYear)
      let lodgementDueDate = dayjs(incorporatedAt).year(annualReturnYear).add(30, "days")
      let daysTillLodgment = dayjs().diff(lodgementDueDate, "days")

      let record = new AnnualReturnRecord()
      record.year = annualReturnYear
      record.date = time.formatDateOnlyShort(annualReturnDate.format("YYYY-MM-DD"))
      record.lodgementDueDate = time.formatDateOnlyShort(lodgementDueDate.format("YYYY-MM-DD"))
      record.daysTillLodgment = daysTillLodgment

      record.isIncoming = annualReturnYear === currentYear && Math.abs(daysTillLodgment) <= 28

      let isOutstanding = this.compliance.value.annualReturnYearsToLodge.includes(annualReturnYear)
      if (isOutstanding) {
        if (daysTillLodgment > 0) {
          record.isOverdue = true
          record.isPaid = false
          record.isLodged = false
          record.noOfDaysOverDue = daysTillLodgment
        } else {
          record.isOverdue = false
          record.isPaid = false
          record.isLodged = false
        }
      } else {
        record.isOverdue = false
        record.isPaid = annualReturnYear <= currentYear
        record.isLodged = daysTillLodgment >= 0
        record.noOfDaysOverDue = 0
      }

      annualReturns.push(record)
    }

    return annualReturns
  }

  get pastAnnualReturnLabel(): string {
    return this.language.isMalay() ? `${this.annualReturnLabel} Yang Lepas` : `Past ${this.annualReturnLabel}`
  }

  get hasPastAnnualReturn(): boolean {
    return this.pastAnnualReturn.length > 0
  }

  get pastAnnualReturn(): AnnualReturnRecord[] {
    let dayjs = useDayjs()
    let currentYear = dayjs().year()

    return this.annualReturns.filter((record: AnnualReturnRecord) => {
      return record.year < currentYear
    })
  }

  get currentAnnualReturnLabel(): string {
    let dayjs = useDayjs()
    let currentYear = dayjs().year()

    return this.language.isMalay()
      ? `${this.annualReturnLabel} Untuk ${currentYear}`
      : `${this.annualReturnLabel} For ${currentYear}`
  }

  get hasCurrentAnnualReturn(): boolean {
    return this.currentAnnualReturn.length > 0
  }

  get currentAnnualReturn(): AnnualReturnRecord[] {
    let dayjs = useDayjs()
    let currentYear = dayjs().year()

    return this.annualReturns.filter((record: AnnualReturnRecord) => {
      return record.year === currentYear
    })
  }

  get futureAnnualReturnLabel(): string {
    return this.language.isMalay() ? `${this.annualReturnLabel} Akan Datang` : `Future ${this.annualReturnLabel}`
  }

  get hasFutureAnnualReturn(): boolean {
    return this.futureAnnualReturn.length > 0
  }

  get futureAnnualReturn(): AnnualReturnRecord[] {
    let dayjs = useDayjs()
    let currentYear = dayjs().year()

    return this.annualReturns.filter((record: AnnualReturnRecord) => {
      return record.year > currentYear
    })
  }
}
