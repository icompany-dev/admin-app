import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Company } from "~/scripts/models/Company"
import { CompanyFinancialPeriod } from "~/scripts/models/CompanyFinancialPeriod"
import { CompanyFinancialStatement } from "~/scripts/models/CompanyFinancialStatement"
import type { PropsFinancialStatementSubmissions } from "~/scripts/props/PropsFinancialStatementSubmissions"
import { StringUtil } from "~/scripts/utils/String"

export class SubmissionsController {
  companyId: Ref<string | null> = ref<string | null>(null)
  searchText: Ref<string | null> = ref<string | null>(null)
  startDate: Ref<string | null> = ref<string | null>(null)
  endDate: Ref<string | null> = ref<string | null>(null)
  isShowWithStatementOnly: Ref<boolean> = ref<boolean>(false)
  isShowPendingOnly: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  currentPage: Ref<number> = ref<number>(1)

  isLoading: Ref<boolean> = ref<boolean>(false)

  companyFinancialPeriods: Ref<CompanyFinancialPeriod[]> = ref<CompanyFinancialPeriod[]>([])
  companyFinancialStatements = ref<CompanyFinancialStatement[]>([])

  selectedFinancialPeriodId: Ref<string> = ref<string>("")

  constructor(props: PropsFinancialStatementSubmissions, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  async setDataFromProps(props: PropsFinancialStatementSubmissions): Promise<void> {
    this.companyId.value = props.companyId
    this.searchText.value = props.searchText
    this.startDate.value = props.startDate
    this.endDate.value = props.endDate
    this.isShowWithStatementOnly.value = props.isShowWithStatementOnly
    this.isShowPendingOnly.value = props.isShowPendingOnly

    await this.init()
  }

  async init(): Promise<void> {
    try {
      this.isLoading.value = true

      let repository = useCompanyFinancialPeriodStore()

      let response = await repository.fetchAll(this.filter)
      this.companyFinancialPeriods.value = response.data.map((d: any) => {
        return new CompanyFinancialPeriod(d)
      })

      let promise = this.companyFinancialPeriods.value.map((fp: CompanyFinancialPeriod) => {
        let financialStatementRepository = useCompanyFinancialStatementStore()
        return financialStatementRepository.byFinancialPeriodId(fp.id).then((r) => {
          this.companyFinancialStatements.value.push(new CompanyFinancialStatement(r))
        })
      })

      await Promise.all(promise)
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  getStartDate(financialPeriod: CompanyFinancialPeriod): string {
    return this.time.formatDateOnlyFull(financialPeriod.startDate)
  }

  getEndDate(financialPeriod: CompanyFinancialPeriod): string {
    return this.time.formatDateOnlyFull(financialPeriod.endDate)
  }

  getTypeOfSubmission(financialPeriod: CompanyFinancialPeriod): string {
    if (this.language.isMalay()) {
      return financialPeriod.isSubmittingAudited ? "Beraudit" : "Tidak Beraudit"
    }

    return financialPeriod.isSubmittingAudited ? "Audited" : "Unaudited"
  }

  getStatusOfSubmission(financialPeriod: CompanyFinancialPeriod): string {
    let financialStatement = this.getFinancialStatement(financialPeriod)
    if (StringUtil.isNullOrEmpty(financialStatement.id)) {
      return financialPeriod.financialStatementStatus ?? "Pending"
    }

    if (financialPeriod.financialStatementStatus === "pending") {
      return StringUtil.isNullOrEmpty(financialStatement.statementId) ? "Pending" : "Uploaded"
    }

    return financialPeriod.financialStatementStatus ?? "Pending"
  }

  getFinancialStatement(financialPeriod: CompanyFinancialPeriod): CompanyFinancialStatement {
    return new CompanyFinancialStatement(
      this.companyFinancialStatements.value.find((fs: any) => {
        return fs.financialPeriodId === financialPeriod.id
      }) ?? null
    )
  }

  onFinancialPeriodClicked(financialPeriod: CompanyFinancialPeriod): void {
    if (this.isShowingDetails(financialPeriod)) {
      this.selectedFinancialPeriodId.value = ""
    } else {
      this.selectedFinancialPeriodId.value = ""
      setTimeout(() => {
        this.selectedFinancialPeriodId.value = financialPeriod.id
      }, 700)
    }
  }

  isShowingDetails(financialPeriod: CompanyFinancialPeriod): boolean {
    return this.selectedFinancialPeriodId.value === financialPeriod.id
  }

  hasUploadedManagementAccount(financialPeriod: CompanyFinancialPeriod): boolean {
    let financialStatement = this.getFinancialStatement(financialPeriod)

    return !StringUtil.isNullOrEmpty(financialStatement.statementId)
  }

  getManagementAccountUrl(financialPeriod: CompanyFinancialPeriod): string {
    let financialStatement = this.getFinancialStatement(financialPeriod)

    return financialStatement.statementFile?.url ?? ""
  }

  get filter(): Filter {
    let filter = new Filter()
    filter.orderBy = "end_date"
    filter.sortOrder = "asc"
    filter.take = 10
    filter.page = this.currentPage.value
    filter.companyId = this.companyId.value
    filter.searchText = this.searchText.value
    filter.startDate = this.startDate.value ? this.time.formatDateOnlySystem(this.startDate.value) : null
    filter.endDate = this.endDate.value ? this.time.formatDateOnlySystem(this.endDate.value) : null

    // if (this.isShowWithStatementOnly) {
    //   filter.statuses = ["uploaded", "lodged", "generated"]
    // }

    // if (this.isShowPendingOnly) {
    //   filter.statuses = ["pending"]
    // }

    return filter
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Serahan" : "Submissions"
  }
}
