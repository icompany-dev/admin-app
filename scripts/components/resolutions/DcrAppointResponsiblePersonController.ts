import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAppointResponsiblePersonController extends ResolutionController<CompanyFinancialStatementAuthorisedPerson> {
  companyFinancialStatementAuthorisedPersonRepository = useCompanyFinancialStatementAuthorisedPersonStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  financialPeriodId = ref<string>("")

  directorNames = ref<string[]>([])

  firstAuthorisedForReport: Ref<string> = ref<string>("")
  secondAuthorisedForReport: Ref<string> = ref<string>("")

  originalTemplateContent: string = ""

  private documentTemplateId: string = "b4be03ea-4c9d-438d-9d7a-3a9d005b3e44"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyFinancialStatementAuthorisedPerson,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.financialPeriodId.value = props.financialPeriodId ?? ""

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
  }

  setFinancialPeriodId(financialPeriodId: string): void {
    this.financialPeriodId.value = financialPeriodId

    if (this.application.value) {
      this.application.value.financialPeriodId = this.financialPeriodId.value
      this.resolutionContent.value = this.getContent()
    }
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (this.isLoading.value) {
      setTimeout(() => {
        this.setApplicationId(id)
      }, 500)
      return
    }

    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }

    this.setContent()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyFinancialStatementAuthorisedPersonRepository.fetch(id)
    if (!this.companyFinancialStatementAuthorisedPersonRepository.error && response !== null) {
      this.application.value = new CompanyFinancialStatementAuthorisedPerson(response)
      if (
        this.application.value.authorisedForReports !== null &&
        !StringUtil.isNullOrEmpty(this.application.value.authorisedForReports)
      ) {
        let authorisedForReports = this.application.value.authorisedForReports.split(",")
        this.firstAuthorisedForReport.value = authorisedForReports[0] ?? ""
        this.secondAuthorisedForReport.value = authorisedForReports[1] ?? ""
      }
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyFinancialStatementAuthorisedPerson()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.financialPeriodId = this.financialPeriodId.value
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content
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

  async otherDataInitiation(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      this.directorNames.value = response.map((d: any) => {
        return d.name
      })
    } catch (e) {
      //
    }
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getDirectorNameOptions(): string {
    return this.directorNames.value
      .map((name: string) => {
        return `<option value='${name}'>`
      })
      .join("")
  }

  getAuthorisedForSignatory(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">NAME OF RESPONSIBLE PERSON</span>'
    }

    if (this.isDocumentEditable()) {
      return `
        <input
          type="text"
          value="${this.application.value?.authorisedForStatutory ?? ""}"
          class='form-control in-resolution' 
          id='authorised-statutory' 
          name='authorisedForStatutory'
          list="authorisedForStatutoryList"
        >
        <datalist id="authorisedForStatutoryList">
          ${this.getDirectorNameOptions()}
        </datalist>
      `
    }

    return this.application.value.authorisedForStatutory?.toUpperCase() ?? "NAME OF RESPONSIBLE PERSON"
  }

  getFirstAuthorisedReports(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">NAME OF RESPONSIBLE PERSON</span>'
    }

    if (this.isDocumentEditable()) {
      return `
        <input
          type="text"
          value="${this.firstAuthorisedForReport.value}"
          class='form-control in-resolution first-authorised-reports' 
          id='first-authorised-reports' 
          name='firstAuthorisedForReports'
          list="firstAuthorisedForReportsList"
        >
        <datalist id="firstAuthorisedForReportsList">
          ${this.getDirectorNameOptions()}
        </datalist>
      `
    }

    return this.firstAuthorisedForReport.value ?? "NAME OF RESPONSIBLE PERSON"
  }

  getSecondAuthorisedReports(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return '<span class="value-placeholder">NAME OF RESPONSIBLE PERSON</span>'
    }

    if (this.isDocumentEditable()) {
      return `
        <input
          type="text"
          value="${this.firstAuthorisedForReport.value}"
          class='form-control in-resolution second-authorised-reports' 
          id='second-authorised-reports' 
          name='secondAuthorisedForReports'
          list="secondAuthorisedForReportsList"
        >
        <datalist id="secondAuthorisedForReportsList">
          ${this.getDirectorNameOptions()}
        </datalist>
      `
    }

    return this.secondAuthorisedForReport.value ?? "NAME OF RESPONSIBLE PERSON"
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let actOrConstitution = "pursuant to Section 251 (2) of the Companies Act, 2016"
    if (this.application.value && this.application.value.company?.hasConstitution) {
      actOrConstitution = "in accordance to constitution"
    }

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=actOrConstitution&gt;$",
      actOrConstitution
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=authorisedForStatutory&gt;$",
      this.getAuthorisedForSignatory()
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=authorisedForReports&gt;$",
      this.getFirstAuthorisedReports()
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=authorisedForReports&gt;$",
      this.getSecondAuthorisedReports()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
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

  handleFirstAuthorisedForReports(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLInputElement

    this.firstAuthorisedForReport.value = target.value
    this.application.value.authorisedForReports = `${this.firstAuthorisedForReport.value},${this.secondAuthorisedForReport.value}`
  }

  handleSecondAuthorisedForReports(event: Event): void {
    if (!this.application.value) {
      return
    }

    let target = event.target as HTMLInputElement

    this.secondAuthorisedForReport.value = target.value

    this.application.value.authorisedForReports = `${this.firstAuthorisedForReport.value},${this.secondAuthorisedForReport.value}`
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    let firstAuthorisedReports = document.querySelectorAll(".first-authorised-reports")
    firstAuthorisedReports.forEach((el) => {
      el.removeEventListener("change", this.handleFirstAuthorisedForReports.bind(this))
      el.addEventListener("change", this.handleFirstAuthorisedForReports.bind(this))
    })

    let secondAuthorisedReports = document.querySelectorAll(".second-authorised-reports")
    secondAuthorisedReports.forEach((el) => {
      el.removeEventListener("change", this.handleSecondAuthorisedForReports.bind(this))
      el.addEventListener("change", this.handleSecondAuthorisedForReports.bind(this))
    })
  }
}
