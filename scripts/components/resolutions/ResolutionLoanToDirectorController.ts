import { useCompanyDirectorLoanStore } from "#imports"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { IdentificationTypes, IdentificationType } from "~/scripts/constants/IdentificationTypes"
import { StringUtil } from "~/scripts/utils/String"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"
import { Director } from "~/scripts/models/Director"

export abstract class ResolutionLoanToDirectorController extends ResolutionController<CompanyDirectorLoan> {
  companyDirectorLoanRepository = useCompanyDirectorLoanStore()
  companyRepository = useCompanyStore()

  directors = ref<Director[]>([])
  noOfShareholders: Ref<number> = ref<number>(1)

  identificationTypeOptions: Array<IdentificationType> = IdentificationTypes.OPTIONS
  directorNames: Ref<string[]> = ref<string[]>([])
  selectedDirectorIds: Ref<string[]> = ref<string[]>([])

  dcrResolutionContentId: string = "f2104919-eac3-4a60-a48a-b0f726440577"
  mcrResolutionContentId: string = "333d1721-0b28-4b12-84d5-aad978fdfd81"

  documentTemplateRepository = useDocumentTemplateStore()
  dcrTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  mcrTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  originalDcrTemplateContent: Ref<string> = ref<string>("")
  originalMcrTemplateContent: Ref<string> = ref<string>("")

  dcrResolutionContent: Ref<string> = ref<string>("")
  mcrResolutionContent: Ref<string> = ref<string>("")
  accompanyingDocumentContent = ref<string>("")

  directorCount: Ref<number> = ref<number>(1)

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanyDirectorLoan | null,
    isInPreviewMode: boolean,
    isDcr: boolean,
    showWatermark: boolean,
    watermarkText: string,
    emitEvents: any | null
  ) {
    super(
      companyId,
      applicationId,
      application,
      CompanyDirectorLoan,
      isInPreviewMode,
      isDcr,
      !isDcr,
      showWatermark,
      watermarkText,
      emitEvents
    )

    this.hasAccompanyingDocument.value = !isDcr
    this.isUsingTemplate.value = true
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyDirectorLoanRepository.fetch(id)
    if (!this.companyDirectorLoanRepository.error) {
      this.application.value = new CompanyDirectorLoan(response)
      this.selectedDirectorIds.value = this.application.value.directorIds
      this.directorNames.value = this.application.value.directorNames
    }
    this.initializeData()
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyDirectorLoan()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.directorNames.value = []
      this.selectedDirectorIds.value = []
    }
    this.initializeData()
  }

  async otherDataInitiation(): Promise<void> {
    await Promise.all([this.fetchDirectors(), this.setNumberOfShareholders(), this.fetchDocumentTemplates()])
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      if (this.directorRepository.error !== null) {
        throw this.directorRepository.error
      }

      this.directors.value = response.map((d: any) => {
        return new Director(d)
      })
    } catch (e) {
      this.directors.value = []
    }
  }

  async setNumberOfShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.noOfShareholders.value = response.length
    } catch (e) {
      this.directors.value = []
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async fetchDocumentTemplates(): Promise<void> {
    try {
      await Promise.all([this.fetchDcrTemplate(), this.fetchMcrTemplate()])
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

  async fetchDcrTemplate(): Promise<void> {
    let templateId = this.dcrResolutionContentId
    let response = await this.documentTemplateRepository.fetch(templateId)
    if (this.documentTemplateRepository.error) {
      throw this.documentTemplateRepository.error
    }

    this.dcrTemplate.value = new DocumentTemplate(response)
    this.originalDcrTemplateContent.value = this.dcrTemplate.value.content
  }

  async fetchMcrTemplate(): Promise<void> {
    let response = await this.documentTemplateRepository.fetch(this.mcrResolutionContentId)
    if (this.documentTemplateRepository.error) {
      throw this.documentTemplateRepository.error
    }

    this.mcrTemplate.value = new DocumentTemplate(response)
    this.originalMcrTemplateContent.value = this.mcrTemplate.value.content
  }

  async setContent(): Promise<void> {
    this.dcrTemplate.value.content = this.originalDcrTemplateContent.value
    this.mcrTemplate.value.content = this.originalMcrTemplateContent.value

    await nextTick(() => {
      this.dcrResolutionContent.value = this.getContent(this.dcrTemplate.value)
      this.mcrResolutionContent.value = this.getContent(this.mcrTemplate.value)
      this.accompanyingDocumentContent.value = this.getAccompanyingDocument()
    })
  }

  getAccompanyingDocument(): string {
    let templateProcessor = new TemplateProcessor(this.mcrTemplate.value)

    return templateProcessor.getPostSignatureContent(this.application.value)
  }

  getDirectorOrDirectorsContent(): string {
    if (this.isDocumentEditable()) {
      // let selectField = `
      //   <select
      //     class="form-control in-resolution"
      //     id='${this.isDcr.value ? "dcr" : "mcr"}-director-count'
      //     name='director-count'
      //   >
      //     <option value='1' ${this.directorCount.value === 1 ? "selected" : ""}>Director</option>
      //     <option value='2' ${this.directorCount.value === 2 ? "selected" : ""}>Directors</option>
      //   </select>
      // `

      // return selectField
      return "Director"
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>Director</span>`
    }

    let directorsOrDirector = this.selectedDirectorIds.value.length > 1 ? "Directors" : "Director"
    return directorsOrDirector
  }

  getDirectorNameContent(): string {
    if (this.isDocumentEditable()) {
      let directorOptions = this.directors.value.map((d: Director) => {
        let selected = this.selectedDirectorIds.value.includes(d.id) ? "selected" : ""
        return `
          <option value="${d.id}" ${selected}>${d.name}</option>
        `
      })

      let selectField = `
        <select
          class="form-control in-resolution"
          id='${this.isDcr.value ? "dcr" : "mcr"}-director-id'
          name='directorId'
        >
          <option></option>
          ${directorOptions.join("")}
        </select>
      `
      return selectField
    } else if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>NAME OF DIRECTOR</span>`
    }

    return `<b>${StringUtil.oxfordJoin("AND", this.directorNames.value)}</b>`
  }

  getDirectorNamePlaceholder(): string {
    if (this.isDocumentEditable() || this.isInPreviewMode.value) {
      if (this.directorNames.value.length <= 0) {
        return `<span class='value-placeholder'>NAME OF DIRECTOR</span>`
      } else {
        return `<b>${StringUtil.oxfordJoin("AND", this.directorNames.value)}</b>`
      }
    }

    return `<b>${StringUtil.oxfordJoin("AND", this.directorNames.value)}</b>`
  }

  getShareholderOrShareholders(): string {
    return this.noOfShareholders.value > 1 ? "shareholders" : "shareholder"
  }

  getLoanAmountContent(): string {
    if (this.isDocumentEditable()) {
      return `
        <input type="number" 
          name="loanAmount" value="${this.application.value?.loanAmount}" 
          class="form-control in-resolution" 
          id='${this.isDcr.value ? "dcr" : "mcr"}-loan-amount'>
      `
    }

    if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>LOAN AMOUNT</span>`
    }

    return this.application.value?.loanAmount.toFixed(2) ?? "0.00"
  }

  getContent(documentTemplate: DocumentTemplate): string {
    documentTemplate.content = documentTemplate.content.replace(
      "$text.&lt;name=directorOrDirectors&gt;$",
      this.getDirectorOrDirectorsContent()
    )

    documentTemplate.content = documentTemplate.content.replace(
      "$text.&lt;name=directorName&gt;$",
      this.getDirectorNameContent()
    )

    documentTemplate.content = documentTemplate.content.replace(
      "$text.&lt;name=loanAmount&gt;$",
      this.getLoanAmountContent()
    )

    documentTemplate.content = documentTemplate.content.replace("%directorName%", this.getDirectorNamePlaceholder())
    documentTemplate.content = documentTemplate.content.replace("%shareholders%", this.getShareholderOrShareholders())

    let templateProcessor = new TemplateProcessor(documentTemplate)

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

  onDirectorOrDirectorsChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement
    this.directorCount.value = Number(selectField.value)

    this.setContent()
  }

  onDirectorIdChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.selectedDirectorIds.value = []
    this.selectedDirectorIds.value.push(selectField.value)
    this.application.value.directorIds = this.selectedDirectorIds.value
    // if (!this.selectedDirectorIds.value.includes(selectField.value)) {
    // }

    let directorNames = this.directors.value
      .filter((d: Director) => {
        return this.selectedDirectorIds.value.includes(d.id)
      })
      .map((d: Director) => {
        return d.name
      })

    this.application.value.directorNames = directorNames
    this.directorNames.value = directorNames

    this.emitEvents("dataChanged")
    this.setContent()
  }

  onLoanAmountChanged(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLInputElement

    this.application.value.loanAmount = Number(inputField.value)

    this.emitEvents("dataChanged")
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    // NOTE: Commenting out until we decided that they can have more than one in one resolution
    // let selectElementId = this.isDcr.value ? "dcr-director-count" : "mcr-director-count"
    // const directorCount = document.getElementById(selectElementId)
    // if (directorCount) {
    //   directorCount.removeEventListener("change", this.onDirectorOrDirectorsChanged.bind(this))
    //   directorCount.addEventListener("change", this.onDirectorOrDirectorsChanged.bind(this))
    // }

    let elementId = this.isDcr.value ? "dcr-director-id" : "mcr-director-id"
    const directorId = document.getElementById(elementId)
    if (directorId) {
      directorId.removeEventListener("change", this.onDirectorIdChanged.bind(this))
      directorId.addEventListener("change", this.onDirectorIdChanged.bind(this))
    }

    let inputElementId = this.isDcr.value ? "dcr-loan-amount" : "mcr-loan-amount"
    const loanAmount = document.getElementById(inputElementId)
    if (loanAmount) {
      loanAmount.removeEventListener("input", this.onLoanAmountChanged.bind(this))
      loanAmount.addEventListener("input", this.onLoanAmountChanged.bind(this))
    }
  }

  onDataChanged(applicationData: CompanyDirectorLoan): void {
    this.application.value = new CompanyDirectorLoan(applicationData)
    this.selectedDirectorIds.value = this.application.value.directorIds
    this.directorNames.value = this.application.value.directorNames
    this.setContent()
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    let totalPages =
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )

    if (this.isDcr.value) {
      return totalPages
    }

    return totalPages
  }

  //copywriting
  directorNameValue(): string {
    if (this.isInPreviewMode.value) {
      return "FULL NAME OF DIRECTOR"
    }

    return StringUtil.oxfordJoin("AND", this.application.value?.directorNames ?? [])
  }
}
