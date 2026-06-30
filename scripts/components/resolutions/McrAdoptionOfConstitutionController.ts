import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class McrAdoptionOfConstitutionController extends ResolutionController<CompanyAmendmentConstitution> {
  companyAmendmentConstitutionRepository = useCompanyAmendmentConstitutionStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  accompanyingDocumentContent = ref<string>("")

  private documentTemplateId: string = "82eaa800-f616-4097-980c-ff39b13873a4"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyAmendmentConstitution>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentConstitution,
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
  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentConstitutionRepository.fetch(id)
    if (!this.companyAmendmentConstitutionRepository.error && response !== null) {
      this.application.value = new CompanyAmendmentConstitution(response)
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentConstitution()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.type = ConstitutionAmendmentTypes.Adopt
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
    this.accompanyingDocumentContent.value = this.getAccompanyingDocument()
    this.hasAccompanyingDocument.value = this.accompanyingDocumentContent.value.length > 0
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getContentForPrint(this.application.value)
  }

  getAccompanyingDocument(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getPostSignatureContent(this.application.value)
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
}
