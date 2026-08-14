import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAmendmentOfConstitutionController extends ResolutionController<CompanyAmendmentConstitution> {
  companyAmendmentConstitutionRepository = useCompanyAmendmentConstitutionStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")

  private documentTemplateId: string = "85864b18-3fbd-4c91-ab39-5f49ff65c9ef"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyAmendmentConstitution>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentConstitution,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
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
    let response = await this.companyAmendmentConstitutionRepository.fetch(id)
    if (!this.companyAmendmentConstitutionRepository.error && response !== null) {
      this.application.value = new CompanyAmendmentConstitution(response)
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
      this.application.value = new CompanyAmendmentConstitution()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.type = ConstitutionAmendmentTypes.Amend
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

  async otherDataInitiation(): Promise<void> {
    //do nothing
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getContentForPrint(this.application.value)
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
