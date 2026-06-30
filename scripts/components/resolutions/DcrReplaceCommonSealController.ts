import { CompanyCommonSealReplacement } from "~/scripts/models/CompanyCommonSealReplacement"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import {
  CommonSealAuthorityOf,
  CommonSealReplacementNullifiedFrom,
  CommonSealReplacementReason,
  CommonSealStoredAt,
} from "~/scripts/constants/CommonSeals"
import { Director } from "~/scripts/models/Director"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrReplaceCommonSealController extends ResolutionController<CompanyCommonSealReplacement> {
  companyCommonSealReplacementRepository = useCompanyCommonSealReplacementStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  directors = ref<Director[]>([])
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  originalTemplateContent: string = ""

  private documentTemplateId: string = "8349263c-7b0e-4de5-bd5b-1f96d15793de"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyCommonSealReplacement>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyCommonSealReplacement,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
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
    let response = await this.companyCommonSealReplacementRepository.fetch(id)
    if (!this.companyCommonSealReplacementRepository.error && response !== null) {
      this.application.value = new CompanyCommonSealReplacement(response)
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
      this.application.value = new CompanyCommonSealReplacement()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
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

  async fetchDirectors(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  async otherDataInitiation(): Promise<void> {
    await this.fetchDirectors()
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getReasonContent(): string {
    if (this.isDocumentEditable()) {
      let disable = this.isInPreviewMode.value ? "disabled" : ""
      let reasonOptions = `
        <select id='reason-option' class='form-select form-control in-resolution' ${disable} name="reason" data-field-name="reason">
          <option value='${CommonSealReplacementReason.Lost}' ${this.application.value?.reason === CommonSealReplacementReason.Lost ? "selected" : ""}>
            lost and cannot be located despite reasonable search
          </option>
          <option value='${CommonSealReplacementReason.Damaged}' ${this.application.value?.reason === CommonSealReplacementReason.Damaged ? "selected" : ""}>
            damaged beyond recognition and impairing the authentication thereof
          </option>
        </select>
      `

      return reasonOptions
    }

    if (this.isInPreviewMode.value) {
      return "<span class='placeholder'>lost and cannot be located despite reasonable search</span>"
    }

    return this.application.value?.reason === CommonSealReplacementReason.Lost
      ? "lost and cannot be located despite reasonable search"
      : `damaged beyond recognition and impairing the authentication thereof`
  }

  getNullifiedFromContent(): string {
    if (this.isDocumentEditable()) {
      let disable = this.isInPreviewMode.value ? "disabled" : ""
      let nullifiedOptions = `
        <select id='nullified-from-option' class='form-select form-control in-resolution' ${disable} name="nullifiedFrom" data-field-name="nullifiedFrom">
          <option value='${CommonSealReplacementNullifiedFrom.ResolutionDate}' ${this.application.value?.nullifiedFrom === CommonSealReplacementNullifiedFrom.ResolutionDate ? "selected" : ""}>
            the date of this Resolution
          </option>
          <option value='${CommonSealReplacementNullifiedFrom.CustomDate}' ${this.application.value?.nullifiedFrom === CommonSealReplacementNullifiedFrom.CustomDate ? "selected" : ""}>
            damaged beyond recognition and impairing the authentication thereof
          </option>
        </select>
      `

      if (this.application.value?.nullifiedFrom === CommonSealReplacementNullifiedFrom.CustomDate) {
        nullifiedOptions = `
          ${nullifiedOptions}
          <input type="date" name="nullifiedAt" class='form-control in-resolution'>
        `
      }

      return nullifiedOptions
    }

    if (this.isInPreviewMode.value) {
      return "<span class='placeholder'>the date of this Resolution</span>"
    }

    return this.application.value?.nullifiedFrom === CommonSealReplacementNullifiedFrom.ResolutionDate
      ? "the date of this Resolution"
      : this.time.formatDateOnlyFull(this.application.value?.nullifiedAt ?? "")
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let reasonSearchString = "$text.&lt;name=reason&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      reasonSearchString,
      this.getReasonContent()
    )

    let nullifiedFromSearchString = "$text.&lt;name=nullifiedFrom&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      nullifiedFromSearchString,
      this.getNullifiedFromContent()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let content = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)

    return content
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

  handleReason(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.reason = inputField.value
  }

  handleNullifiedFrom(event: Event): void {
    if (!this.application.value) {
      return
    }

    const inputField = event.target as HTMLSelectElement

    this.application.value.nullifiedFrom = inputField.value
    this.setContent()
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const reasonSelector = document.getElementById("reason-option")
    if (reasonSelector) {
      reasonSelector.removeEventListener("change", this.handleReason.bind(this))
      reasonSelector.addEventListener("change", this.handleReason.bind(this))
    }

    const nullifiedFromSelector = document.getElementById("nullified-from-option")
    if (nullifiedFromSelector) {
      nullifiedFromSelector.removeEventListener("change", this.handleNullifiedFrom.bind(this))
      nullifiedFromSelector.addEventListener("change", this.handleNullifiedFrom.bind(this))
    }
  }
}
