import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
import { Shareholder } from "~/scripts/models/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { StringUtil } from "~/scripts/utils/String"

export class ManagementAccountForStrikingOffController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  totalShares: Ref<number> = ref<number>(0)
  totalSecretarialFees: Ref<number> = ref<number>(365)

  financialYearEndDate: Ref<string> = ref<string>("")
  financialYearStartDate: Ref<string> = ref<string>("")

  managementAccount = ref<CompanyManagementAccount>(new CompanyManagementAccount())

  isSwitched: Ref<boolean> = ref<boolean>(false)
  isLoading: Ref<boolean> = ref<boolean>(false)

  addiitonalCssClass: string = "management-account"
  paperOrientation: string = PaperOrientation.Portrait

  emitEvents: any | null = null

  dayjs = useDayjs()
  time = useLocalTime()

  constructor(companyId: string, financialYearStartDate: string, financialYearEndDate: string, emitEvents: any) {
    this.emitEvents = emitEvents
    this.setCompanyId(companyId)
    this.setFinancialYearStartDate(financialYearStartDate)
    this.setFinancialYearEndDate(financialYearEndDate)
  }

  setFinancialYearStartDate(financialYearStartDate: string): void {
    this.financialYearStartDate.value = financialYearStartDate
  }

  setFinancialYearEndDate(financialYearEndDate: string): void {
    this.financialYearEndDate.value = financialYearEndDate
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    try {
      this.isLoading.value = true

      await Promise.all([this.fetchCompany(), this.fetchShareholders(), this.fetchIsSwitched()])

      if (this.isSwitchWithinFye || this.isIncorporatedWithinFye) {
        this.totalSecretarialFees.value = 0 // fees included in the subscription value
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.company.value = new Company(response)
    } catch (e) {
      this.company.value = new Company()
      if (e instanceof Error) {
        throw e
      } else {
        let error = new Error("", "")
        error.setForFetch()
        throw error
      }
    }
  }

  async fetchIsSwitched(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let repository = useCompanyStore()
      let response = await repository.isSwitched(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.isSwitched.value = response
    } catch (e) {
      this.isSwitched.value = false
      if (e instanceof Error) {
        throw e
      } else {
        let error = new Error("", "")
        error.setForFetch()
        throw error
      }
    }
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let repository = useShareholderStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.totalShares.value = response
        .map((s: any) => {
          let shareholder = new Shareholder(s)
          return Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
        })
        .reduce((a: number, b: number) => {
          return a + b
        }, 0)
    } catch (e) {
      this.totalShares.value = 0
      if (e instanceof Error) {
        throw e
      } else {
        let error = new Error("", "")
        error.setForFetch()
        throw error
      }
    }
  }

  get isIncorporatedWithinFye(): boolean {
    if (this.isSwitched.value) {
      return false
    }

    let incorporatedAt = this.dayjs(this.company.value.incorporatedAt ?? "")
    let fyeStart = this.dayjs(this.financialYearStartDate.value)

    return incorporatedAt.isSame(fyeStart) || incorporatedAt.isAfter(fyeStart)
  }

  get isSwitchWithinFye(): boolean {
    if (!this.isSwitched.value) {
      return false
    }

    let createdAt = this.dayjs(this.company.value.createdAt ?? "")
    let fyeStart = this.dayjs(this.financialYearStartDate.value)

    return createdAt.isSame(fyeStart) || createdAt.isAfter(fyeStart)
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Management Account"
  }

  get formattedShareCapital(): string {
    return NumberUtil.currency(this.totalShares.value)
  }

  get retainedEarnings(): string {
    return NumberUtil.currency(this.totalExpenses)
  }

  get shareholdersDeficit(): string {
    let total = this.totalShares.value - this.totalExpenses

    if (total > 0) {
      return NumberUtil.currency(total)
    } else {
      total = Math.abs(total)
      return `(${NumberUtil.currency(total)})`
    }
  }

  get totalLiabilities(): string {
    let total = this.totalShares.value - this.totalExpenses

    if (total > 0) {
      return `(${NumberUtil.currency(total)})`
    } else {
      total = Math.abs(total)
      return NumberUtil.currency(total)
    }
  }

  get totalExpenses(): number {
    let total = this.totalSecretarialFees.value
    if (this.isIncorporatedWithinFye) {
      total += 1499
    }

    if (this.isSwitchWithinFye) {
      total += 499
    }

    return total
  }

  get incorporationFees(): string {
    return "1,499.00"
  }

  get switchFees(): string {
    return "499.00"
  }

  get secretarialFees(): string {
    return NumberUtil.currency(this.totalSecretarialFees.value)
  }

  get formattedStartDate(): string {
    return this.time.formatDateOnlyFull(this.financialYearStartDate.value)
  }

  get formattedEndDate(): string {
    return this.time.formatDateOnlyFull(this.financialYearEndDate.value)
  }
}
