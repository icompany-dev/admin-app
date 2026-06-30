import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import { ResolutionController } from "./ResolutionController"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"

export class McrStrikingOffController extends ResolutionController<CompanyStrikingOffResolution> {
  companyStrikingOffRepository = useCompanyStrikingOffResolutionStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  resolutionContent = ref<string>("")
  originalDocumentTemplateContent: string = ""
  accompanyingDocumentContent = ref<string>("")

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  private documentTemplateId: string = "cc6904fd-d131-4779-a83e-467ce2b2c8be"

  constructor(props: IPropsResolutionDocument<CompanyStrikingOffResolution>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyStrikingOffResolution,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }

    await this.getPersonsToSign()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyStrikingOffRepository.fetch(id)
    if (!this.companyStrikingOffRepository.error && response !== null) {
      this.application.value = new CompanyStrikingOffResolution(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyStrikingOffResolution()
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
      this.originalDocumentTemplateContent = this.documentTemplate.value.content
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
    // do nothing
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
    this.accompanyingDocumentContent.value = this.getAccompanyingDocument()
    this.hasAccompanyingDocument.value = this.accompanyingDocumentContent.value.length > 0
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalDocumentTemplateContent

    let applicantName = ""
    if (this.isInPreviewMode.value) {
      applicantName = '<span class="value-placeholder">THE APPLICANT</span>'
    } else {
      if (StringUtil.isNullOrEmpty(this.application.value?.applicant.name ?? "")) {
        applicantName = "THE APPLICANT"
      } else {
        applicantName = this.application.value?.applicant.name ?? "THE APPLICANT"
      }
    }

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=applicantName&gt;$",
      applicantName.toUpperCase()
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

  getAccompanyingDocument(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getPostSignatureContent(this.application.value)
  }

  totalPages(): number {
    if (this.shareholderRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  async refreshData(): Promise<void> {
    await this.fetchApplication(this.applicationId.value ?? "")
    await this.initializeData()
  }
}
