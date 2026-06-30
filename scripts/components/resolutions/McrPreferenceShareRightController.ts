import { CompanyPreferenceShareRight } from "~/scripts/models/CompanyPreferenceShareRight"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class McrPreferenceShareRightController extends ResolutionController<CompanyPreferenceShareRight> {
  companyPreferenceShareRightRepository = useCompanyPreferenceShareRightStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")

  private documentTemplateId: string = "3eadd419-3f19-416e-8d58-192494c92cc9"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyPreferenceShareRight>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyPreferenceShareRight,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6

    this.isUsingTemplate.value = true
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyPreferenceShareRightRepository.fetch(id)
    if (!this.companyPreferenceShareRightRepository.error && response !== null) {
      this.application.value = new CompanyPreferenceShareRight(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyPreferenceShareRight()
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

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getContentForPrint(this.application.value)
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
}
