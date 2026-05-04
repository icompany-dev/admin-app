// This library is where we check all the compliance requirements
// 1. Annual Return
// 2. Financial Year End
// 3. Subsription (?) --> check if the alert for subscription fee will be through this
import { StatusConstants } from "../constants/Status"
import { Company } from "../models/Company"
import { CompanyFinancialPeriod } from "../models/CompanyFinancialPeriod"
import { CompanySetFinancialYearEnd } from "../models/CompanySetFinancialYearEnd"
import { StringUtil } from "../utils/String"
import { Filter } from "./Filter"

export class Compliance {
  companyId: string = ""
  company: Company = new Company()

  hasSetFinancialYearEnd: boolean = false
  hasPaidAnnualReturn: boolean = false

  ongoingCompanySetFinancialYearEnd: CompanySetFinancialYearEnd | null = null

  currentFinancialPeriod: CompanyFinancialPeriod = new CompanyFinancialPeriod()
  currentFYEStartDate: string | null = null
  currentFYEEndDate: string | null = null

  deadlineToSetFirstFYE: string | null = null
  currentYearAnnualReturnDueDate: string | null = null
  annualReturnYearsToLodge: number[] = []
  annualReturnYearToLodge: number | null = null

  hasCommonSeal: boolean = false

  hasAppointedAuditor: boolean = false

  companyRepository = useCompanyStore()
  companyAnnualReturnRepository = useCompanyAnnualReturnStore()
  companyFinancialPeriodRepository = useCompanyFinancialPeriodStore()
  companySetFinancialYearEndRepository = useCompanySetFinancialYearEndStore()
  companyCommonSealRepository = useCompanyCommonSealStore()
  companyAuditorRepository = useCompanyAuditorStore()

  isProcessing: boolean = false

  constructor(companyId: string) {
    this.companyId = companyId

    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    this.init()
  }

  async init(): Promise<void> {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true
    await Promise.all([
      this.fetchCompany(),
      this.checkFinancialYearEnd(),
      this.fetchCurrentFinancialPeriod(),
      this.fetchOngoingCompanySetFinancialYearEnd(),
      this.setupHasCommonSeal(),
      this.setupHasAppointedAuditor(),
    ])
    await this.setupAnnualReturn()

    this.isProcessing = false
  }

  async fetchCompany(): Promise<void> {
    try {
      const response = await this.companyRepository.fetch(this.companyId)
      if (this.companyRepository.error !== null) {
        throw this.companyRepository.error
      }

      this.company = new Company(response)
      const dayjs = useDayjs()
      this.deadlineToSetFirstFYE = dayjs(this.company.incorporatedAt)
        .add(11, "months")
        .add(2, "weeks")
        .format("YYYY-MM-DD")
    } catch (e: any) {
      console.error(`Fail to fetch company for Compliance:`, e) // No toast to prevent multiple alerts
    }
  }

  async checkFinancialYearEnd(): Promise<void> {
    try {
      this.hasSetFinancialYearEnd = await this.companyFinancialPeriodRepository.hasSetFinancialYearEnd(this.companyId)
    } catch (e: any) {
      console.error(`Fail to check set FYE for company:`, e) // No toast to prevent multiple alerts
    }
  }

  async fetchCurrentFinancialPeriod(): Promise<void> {
    try {
      let response = await this.companyFinancialPeriodRepository.current(this.companyId)
      if (this.companyFinancialPeriodRepository.error !== null) {
        throw this.companyFinancialPeriodRepository.error
      }

      this.currentFinancialPeriod = new CompanyFinancialPeriod(response)
      this.currentFYEStartDate = this.currentFinancialPeriod.startDate
      this.currentFYEEndDate = this.currentFinancialPeriod.endDate
    } catch (e: any) {
      console.error(`Fail to fetch current FYE for company:`, e) // No toast to prevent multiple alerts
    }
  }

  async fetchOngoingCompanySetFinancialYearEnd(): Promise<void> {
    try {
      let response = await this.companySetFinancialYearEndRepository.ongoing(this.companyId)
      if (this.companyFinancialPeriodRepository.error !== null) {
        throw this.companySetFinancialYearEndRepository.error
      }

      if (!response) {
        this.ongoingCompanySetFinancialYearEnd = null
      } else {
        this.ongoingCompanySetFinancialYearEnd = new CompanySetFinancialYearEnd(response)
      }
    } catch (e: any) {
      console.error("Fail to fetch ongoing set financial year end application", e)
    }
  }

  async setupHasCommonSeal(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.includeDeleted = true
      filter.statuses = [StatusConstants.COMPLETED, StatusConstants.CONVERTED]
      filter.take = 1

      let response = await this.companyCommonSealRepository.fetchAll(filter)
      this.hasCommonSeal = this.companyCommonSealRepository.error === null && response.totalRecords > 0
    } catch (e) {
      this.hasCommonSeal = false
    }
  }

  async setupHasAppointedAuditor(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.take = 1

      let response = await this.companyAuditorRepository.fetchAll(filter)
      this.hasAppointedAuditor = this.companyAuditorRepository.error === null && response.totalRecords > 0
    } catch (e) {
      this.hasAppointedAuditor = false
    }
  }

  async setupAnnualReturn(): Promise<void> {
    try {
      let response = await this.companyAnnualReturnRepository.fetchDues(this.companyId)
      if (this.companyAnnualReturnRepository.error !== null) {
        throw this.companyAnnualReturnRepository.error
      }

      this.annualReturnYearsToLodge = response ?? []
      this.annualReturnYearsToLodge.sort((a: number, b: number) => {
        return b - a
      })
      this.annualReturnYearToLodge = this.annualReturnYearsToLodge.length > 0 ? this.annualReturnYearsToLodge[0] : null
    } catch (e: any) {
      console.error(`Fail to setup annual return for company:`, e)
    }

    const dayjs = useDayjs()
    let currentYear = dayjs().year()
    let yearToLodge = currentYear
    if (this.annualReturnYearToLodge && this.annualReturnYearToLodge === currentYear) {
      yearToLodge = this.annualReturnYearToLodge
    } else {
      yearToLodge = currentYear + 1 // allow them to pay for future
    }

    this.currentYearAnnualReturnDueDate = dayjs(this.company.incorporatedAt).year(yearToLodge).format("YYYY-MM-DD")
  }

  isLateToSetFYE(): boolean {
    if (this.hasSetFinancialYearEnd) {
      return false
    }

    // maximum: 11months 2 weeks
    const dayjs = useDayjs()
    let deadline = dayjs(this.company.incorporatedAt).add(11, "months").add(2, "weeks")

    return deadline.isBefore(dayjs())
  }
}
