import { DocumentTypes } from "~/scripts/constants/DocumentTypes"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Ocr } from "~/scripts/library/Ocr"
import { Company } from "~/scripts/models/Company"
import { CompanyFinancialPeriod } from "~/scripts/models/CompanyFinancialPeriod"
import { CompanyFinancialStatement, FinancialStatementData } from "~/scripts/models/CompanyFinancialStatement"
import { File as UploadedFile } from "~/scripts/models/File"
import { GeminiAiJobStatusResponse } from "~/scripts/models/GeminiAiJobStatusResponse"
import type { PropsFinancialStatementSubmissions } from "~/scripts/props/PropsFinancialStatementSubmissions"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class SubmissionsController {
  companyId: Ref<string | null> = ref<string | null>(null)
  searchText: Ref<string | null> = ref<string | null>(null)
  startDate: Ref<string | null> = ref<string | null>(null)
  endDate: Ref<string | null> = ref<string | null>(null)
  isShowWithStatementOnly: Ref<boolean> = ref<boolean>(false)
  isShowPendingOnly: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  ufsRef: any | null = null

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  currentPage: Ref<number> = ref<number>(1)

  isLoading: Ref<boolean> = ref<boolean>(false)

  isDownloadingUfs: Ref<boolean> = ref<boolean>(false)

  companyFinancialPeriods: Ref<CompanyFinancialPeriod[]> = ref<CompanyFinancialPeriod[]>([])
  companyFinancialStatements = ref<CompanyFinancialStatement[]>([])

  selectedFinancialPeriodId: Ref<string> = ref<string>("")

  isManagementAccountEnlarged: Ref<boolean> = ref<boolean>(false)
  isFinancialStatementEnlarged: Ref<boolean> = ref<boolean>(false)

  isGeneratingUFS: Ref<boolean> = ref<boolean>(false)
  ocr = ref<Ocr>(new Ocr())
  isOcrRunning: Ref<boolean> = ref<boolean>(false)
  isOcrCompleted: Ref<boolean> = ref<boolean>(false)
  jobStatusResponses: Ref<GeminiAiJobStatusResponse[]> = ref<GeminiAiJobStatusResponse[]>([])

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

  setUfsRef(ufsRef: any): void {
    this.ufsRef = ufsRef
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
    if (this.isGeneratingUFS.value) {
      return
    }

    if (this.isShowingDetails(financialPeriod)) {
      this.selectedFinancialPeriodId.value = ""
    } else {
      this.selectedFinancialPeriodId.value = ""
      setTimeout(() => {
        this.selectedFinancialPeriodId.value = financialPeriod.id
      }, 700)
    }
  }

  async onGenerateUFSClicked(financialPeriod: CompanyFinancialPeriod): Promise<void> {
    if (this.isGeneratingUFS.value || !this.hasUploadedManagementAccount(financialPeriod)) {
      return
    }

    try {
      this.isGeneratingUFS.value = true

      await this.runOcr(financialPeriod)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
      }
      this.isGeneratingUFS.value = false
    }
  }

  onManagementAccountClicked(): void {
    this.isManagementAccountEnlarged.value = !this.isManagementAccountEnlarged.value
  }

  onMinimizeManagementAccount(): void {
    this.isManagementAccountEnlarged.value = false
  }

  onFinancialStatementClicked(): void {
    this.isFinancialStatementEnlarged.value = !this.isFinancialStatementEnlarged.value
  }

  onMinimizeFinancialStatement(): void {
    this.isFinancialStatementEnlarged.value = false
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

  getManagementAccount(financialPeriod: CompanyFinancialPeriod): UploadedFile {
    let financialStatement = this.getFinancialStatement(financialPeriod)

    return financialStatement.statementFile ?? new UploadedFile()
  }

  getIsGeneratingUFS(financialPeriod: CompanyFinancialPeriod): boolean {
    return this.isShowingDetails(financialPeriod) && this.isGeneratingUFS.value
  }

  getIsManagementAccountEnlarged(financialPeriod: CompanyFinancialPeriod): boolean {
    return this.isShowingDetails(financialPeriod) && this.isManagementAccountEnlarged.value
  }

  getIsFinancialStatementEnlarged(financialPeriod: CompanyFinancialPeriod): boolean {
    return this.isShowingDetails(financialPeriod) && this.isFinancialStatementEnlarged.value
  }

  async runOcr(financialPeriod: CompanyFinancialPeriod): Promise<void> {
    if (!this.hasUploadedManagementAccount(financialPeriod)) {
      return
    }

    let dayjs = useDayjs()
    let endDate = dayjs(financialPeriod.endDate).format("YYYY-MM-DD")
    let startDate = dayjs(financialPeriod.startDate).format("YYYY-MM-DD")

    let managementAccount = this.getManagementAccount(financialPeriod)
    let fileUrl = managementAccount.url
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const file = new File([blob], managementAccount.name, {
      type: managementAccount.mimeType || blob.type || "application/octet-stream",
      lastModified: Date.now(),
    })
    this.ocr.value.documentCategory = DocumentTypes.CATEGORY_UNAUDITED
    this.ocr.value.financialYearEnd = endDate
    this.ocr.value.totalShares = 100 // we will allow them to change in the document itself
    this.isOcrRunning.value = true
    this.isOcrCompleted.value = false
    await this.ocr.value.processFile(file)
    await this.ocr.value.run()

    this.checkOcrStatus()
  }

  async checkOcrStatus(): Promise<void> {
    if (this.ocr.value.isProcessing) {
      setTimeout(() => {
        this.checkOcrStatus()
      }, 500)
      return
    }

    await this.postOcrCompleted()
    this.isOcrRunning.value = false
  }

  async postOcrCompleted(): Promise<void> {
    this.isOcrCompleted.value = true

    this.jobStatusResponses.value = this.ocr.value.geminiAi.jobStatuses.map((js: GeminiAiJobStatusResponse) => {
      return new GeminiAiJobStatusResponse(js)
    })

    if (this.jobStatusResponses.value.length <= 0) {
      return
    }

    let firstResponse = this.jobStatusResponses.value[0]
    const data = firstResponse.result
    const regex = /```([\s\S]*?)```/
    const matchedData = data.match(regex)

    if (!matchedData || !matchedData[0]) {
      return
    }

    let info = matchedData[1].trim()
    info = info.replace("json", "")

    let jsonObject = JSON.parse(info)

    let financialStatement = this.getFinancialStatement(this.selectedFinancialPeriod)

    financialStatement.isProfitable = jsonObject.is_profit_or_loss === "profit" ?? false
    financialStatement.exemptionType = jsonObject.type_of_exemption ?? []
    financialStatement.statementData = new FinancialStatementData(jsonObject)

    if (!StringUtil.isNullOrEmpty(financialStatement.id)) {
      await financialStatement.update(useCompanyFinancialStatementStore())
    }

    this.companyFinancialStatements.value.forEach((fs: any) => {
      if (fs.id === financialStatement.id) {
        fs = new CompanyFinancialStatement(financialStatement) // refresh data
      }
    })

    this.isGeneratingUFS.value = false
  }

  getExemptionTypeDetails(exemptionType: string): string {
    if (StringUtil.isEqual(exemptionType, "dormant")) {
      return "was dormant"
    }

    if (StringUtil.isEqual(exemptionType, "zero-revenue")) {
      return "generated no revenue."
    }

    return "generated revenue less than the threshold amount."
  }

  getIsShowUFS(financialPeriod: CompanyFinancialPeriod): boolean {
    if (!this.hasUploadedManagementAccount(financialPeriod)) {
      return false
    }

    let financialStatement = this.getFinancialStatement(financialPeriod)

    return financialStatement.statementData.notesToTheFinancialStatements.length > 0
  }

  getPropsForFinancialStatement(
    financialPeriod: CompanyFinancialPeriod
  ): PropsResolutionDocument<CompanyFinancialStatement> {
    let financialStatement = this.getFinancialStatement(financialPeriod)

    let props = new PropsResolutionDocument<CompanyFinancialStatement>(
      financialPeriod.companyId,
      financialStatement.id,
      financialStatement,
      false,
      "",
      false,
      false
    )

    props.financialYearEnd = financialPeriod.endDate

    return props
  }

  async onDownloadUFS(): Promise<void> {
    if (!this.ufsRef || this.isDownloadingUfs.value) {
      return
    }

    try {
      this.isDownloadingUfs.value = true

      let pages = await this.ufsRef.getPdfElements()
      let filename = `Unaudited Financial Statement.pdf`

      await PdfPaperUtil.generatePdfFile(pages, 20, filename, PaperSize.A4, PaperOrientation.Portrait)
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloadingUfs.value = false
    }
  }

  get selectedFinancialPeriod(): CompanyFinancialPeriod {
    return new CompanyFinancialPeriod(
      this.companyFinancialPeriods.value.find((fp: CompanyFinancialPeriod) => {
        return fp.id === this.selectedFinancialPeriodId.value
      })
    )
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

  get actionTrayElementForUFS(): ActionTrayElement[] {
    return [
      new ActionTrayElement("download", this.onDownloadUFS.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
        isDisabled: this.isDownloadingUfs.value,
        iconClass: this.isDownloadingUfs.value ? "fa-solid fa-spin fa-spinner" : "",
        isIconStart: this.isDownloadingUfs.value,
      }),
    ]
  }
}
