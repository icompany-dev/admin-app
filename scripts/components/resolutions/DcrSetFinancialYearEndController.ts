import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import { ResolutionController } from "./ResolutionController"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { FinancialYearEndConstants } from "~/scripts/constants/FinancialYearEnds"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { Compliance } from "~/scripts/library/Compliance"

export class DcrSetFinancialYearEndController extends ResolutionController<CompanySetFinancialYearEnd> {
  companySetFinancialYearEndRepository = useCompanySetFinancialYearEndStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplates = ref<DocumentTemplate[]>([])

  resolutionContent = ref<string>("")

  private setFyeTemplateId: string = "860cacca-59d8-40e5-819d-67b7e02f7c73"
  private changeFyeTemplateId: string = "ff2307e7-cb99-4983-be56-dbce15a303fc"

  type = ref<string>("set")

  time = useLocalTime()

  compliance = ref<Compliance>(new Compliance(""))

  signatureFileData: Ref<string> = ref<string>("")

  constructor(props: IPropsResolutionDocument<CompanySetFinancialYearEnd>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanySetFinancialYearEnd,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.isDcr.value = true
    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6

    this.setApplicationType(props.type ?? "")
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  setApplicationType(type: string): void {
    if (!this.application.value || StringUtil.isNullOrEmpty(type)) {
      return
    }

    this.type.value = type

    this.application.value.type = type

    this.setContent()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companySetFinancialYearEndRepository.fetch(id)
    if (!this.companySetFinancialYearEndRepository.error && response !== null) {
      this.application.value = new CompanySetFinancialYearEnd(response)

      if (!StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate)) {
        this.application.value.fyeDateMonth = this.time.formatDateMonthOnlyFull(
          this.application.value.financialYearEndDate
        )
      }
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanySetFinancialYearEnd()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.type = this.type.value

      if (this.type.value === FinancialYearEndConstants.AMENDMENT_TYPE_SET) {
        this.application.value.financialPeriodStartDate = this.time.formatDateOnlySystem(company.incorporatedAt ?? "")
        this.application.value.financialPeriodEndDate = this.dayjs(company.incorporatedAt ?? "")
          .add(18, "months")
          .format("YYYY-MM-DD")
        this.application.value.financialYearEndDate = this.dayjs(company.incorporatedAt ?? "")
          .add(18, "months")
          .format("YYYY-MM-DD")
      }

      if (!StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate)) {
        this.application.value.fyeDateMonth = this.time.formatDateMonthOnlyFull(
          this.application.value.financialYearEndDate
        )
      }
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchDocumentTemplates(), this.fetchCurrentFinancialYear()])
  }

  async fetchDocumentTemplates(): Promise<void> {
    try {
      const filter = new Filter()
      filter.searchText = "financial year end"
      let response = await this.documentTemplateRepository.fetchAll(filter)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplates.value = response.data.filter((d: DocumentTemplate) => {
        return d.id === this.setFyeTemplateId || d.id === this.changeFyeTemplateId
      })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchCurrentFinancialYear(): Promise<void> {
    this.compliance.value.companyId = this.companyId.value
    await this.compliance.value.fetchCurrentFinancialPeriod()
  }

  getDocumentTemplate(): DocumentTemplate {
    if (!this.application.value) {
      return new DocumentTemplate()
    }

    let documentTemplate = this.documentTemplates.value.find((dt: DocumentTemplate) => {
      if (!this.application.value) {
        return false
      }

      if (this.application.value.type === FinancialYearEndConstants.AMENDMENT_TYPE_SET) {
        return dt.id === this.setFyeTemplateId
      }

      return dt.id === this.changeFyeTemplateId
    })

    return new DocumentTemplate(documentTemplate) ?? new DocumentTemplate()
  }

  setContent(): void {
    if (this.application.value) {
      this.application.value.financialPeriodStartDate = this.compliance.value.currentFYEStartDate ?? ""
    }
    this.resolutionContent.value = this.getContent()
  }

  getCurrentFinancialYearEnd(): string {
    if (StringUtil.isNullOrEmpty(this.compliance.value.currentFYEEndDate)) {
      return "YOUR FINANCIAL YEAR END DATE"
    }

    return this.time.formatDateOnlyFull(this.compliance.value.currentFYEEndDate ?? "").toUpperCase()
  }

  getNewFYEField(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR NEW FINANCIAL YEAR END DATE</span>`
    }

    let maxDate = ""
    if (!StringUtil.isNullOrEmpty(this.compliance.value.currentFYEStartDate)) {
      let aYearAfter = this.dayjs(this.compliance.value.currentFYEStartDate).add(1, "year")
      maxDate = `max='${aYearAfter.format("YYYY-MM-DD")}'`
    }

    if (this.isDocumentEditable()) {
      return `<input type='date' class='form-control in-resolution new-fye' ${maxDate} value='${this.application.value.financialYearEndDate}' id='new-fye' placeholder='Your New FYE'>`
    }

    return this.time.formatDateOnlyFull(this.application.value.financialYearEndDate)
  }

  getNewStartDateField(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR NEW FINANCIAL YEAR START DATE</span>`
    }

    if (StringUtil.isNullOrEmpty(this.compliance.value.currentFYEStartDate)) {
      return `<span class='value-placeholder'>YOUR NEW FINANCIAL YEAR START DATE</span>`
    }

    return this.time.formatDateOnlyFull(this.compliance.value.currentFYEStartDate ?? "")
  }

  getNewEndDateField(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR NEW FINANCIAL YEAR END DATE</span>`
    }

    if (StringUtil.isNullOrEmpty(this.application.value.financialPeriodEndDate)) {
      return `<span class='value-placeholder'>YOUR NEW FINANCIAL YEAR END DATE</span>`
    }

    return this.time.formatDateOnlyFull(this.application.value.financialPeriodEndDate ?? "")
  }

  getSubsequentValues(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR SUBSEQUENT END DATE</span>`
    }

    if (StringUtil.isNullOrEmpty(this.application.value.financialPeriodEndDate)) {
      return `<span class='value-placeholder'>YOUR SUBSQUENT END DATE</span>`
    }

    return this.time.formatDateMonthOnlyFull(this.application.value.financialPeriodEndDate ?? "")
  }

  getNumberOfMonths(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>DURATION IN MONTHS</span>`
    }

    if (StringUtil.isNullOrEmpty(this.application.value.financialPeriodEndDate)) {
      return `<span class='value-placeholder'>DURATION IN MONTHS</span>`
    }

    let startDate = this.dayjs(this.application.value.financialPeriodStartDate)
    let endDate = this.dayjs(this.application.value.financialPeriodEndDate)

    return endDate.diff(startDate, "months").toString()
  }

  getContent(): string {
    let documentTemplate = this.getDocumentTemplate()

    let currentFyeSearchString = "$text.&lt;name=currentFYE&gt;$"
    documentTemplate.content = documentTemplate.content.replace(
      currentFyeSearchString,
      this.getCurrentFinancialYearEnd()
    )

    let previousFyeSearchString = "$date.&lt;name=previousFinancialYearEnd&gt;$"
    documentTemplate.content = documentTemplate.content.replace(
      previousFyeSearchString,
      this.getCurrentFinancialYearEnd()
    )

    let newFyeFieldSearchString = "$date.&lt;name=financialYearEndDate&gt;$"
    documentTemplate.content = documentTemplate.content.replace(newFyeFieldSearchString, this.getNewFYEField())

    let startDateSearchString = "$date.&lt;name=financialPeriodStartDate&gt;$"
    documentTemplate.content = documentTemplate.content.replace(startDateSearchString, this.getNewStartDateField())

    let endDateSearchString = "$date.&lt;name=financialPeriodEndDate&gt;$"
    documentTemplate.content = documentTemplate.content.replace(endDateSearchString, this.getNewEndDateField())

    let subsequentSearchString = "$text.&lt;name=fyeDateMonth&gt;$"
    documentTemplate.content = documentTemplate.content.replace(subsequentSearchString, this.getSubsequentValues())

    let numberOfMonthsSearchString = "$text.&lt;name=numberOfMonths&gt;$"
    documentTemplate.content = documentTemplate.content.replace(numberOfMonthsSearchString, this.getNumberOfMonths())

    let templateProcessor = new TemplateProcessor(documentTemplate)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    return this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  handleSetNewFYE(event: Event): void {
    console.log("called???")
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    this.application.value.financialYearEndDate = inputField.value
    this.application.value.financialPeriodEndDate = inputField.value

    if (this.type.value !== "set") {
      let startDate = this.dayjs(this.application.value.financialPeriodEndDate)
        .subtract(1, "year")
        .add(1, "day")
        .format("YYYY-MM-DD")
      this.application.value.financialPeriodStartDate = startDate
    }

    this.setContent()

    if (this.isAllCompleted) {
      this.emitEvents("signed", this.signatureFileData.value)
    }
  }

  handleSetNewStartDate(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.financialPeriodStartDate = inputField.value
    this.setContent()

    if (this.isAllCompleted) {
      this.emitEvents("signed", this.signatureFileData.value)
    }
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const newFyeSelectors = document.querySelectorAll(".new-fye")
    newFyeSelectors.forEach((s) => {
      s.removeEventListener("input", this.handleSetNewFYE.bind(this))
      s.addEventListener("input", this.handleSetNewFYE.bind(this))
    })

    const newStartDateSelectors = document.querySelectorAll(".new-start-date")
    newStartDateSelectors.forEach((s) => {
      s.removeEventListener("change", this.handleSetNewStartDate.bind(this))
      s.addEventListener("change", this.handleSetNewStartDate.bind(this))
    })
  }

  onSigned(signatureFileData: string): void {
    this.signatureFileData.value = signatureFileData

    if (this.isAllCompleted) {
      this.emitEvents("signed", this.signatureFileData.value)
    }
  }

  get isAllCompleted(): boolean {
    if (!this.application.value) {
      return false
    }

    if (this.type.value === "set") {
      return (
        !StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate) &&
        !StringUtil.isNullOrEmpty(this.signatureFileData.value)
      )
    }

    return (
      !StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate) &&
      !StringUtil.isNullOrEmpty(this.application.value.financialPeriodStartDate) &&
      !StringUtil.isNullOrEmpty(this.signatureFileData.value)
    )
  }
}
