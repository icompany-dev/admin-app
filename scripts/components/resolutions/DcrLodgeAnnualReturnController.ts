import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrLodgeAnnualReturnController extends ResolutionController<CompanyAnnualReturnRequest> {
  companyAnnualReturnRequestRepository = useCompanyAnnualReturnRequestStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")

  yearToLodge = ref<string>("")

  private documentTemplateId: string = "ad05acbf-bf55-457f-bafd-f1ca6a3a92d1"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyAnnualReturnRequest>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAnnualReturnRequest,
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

    this.setYearToLodge(props.yearToLodge ?? "")
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }

    this.initializeData()
    this.setContent()
  }

  setYearToLodge(yearToLodge: string): void {
    this.yearToLodge.value = yearToLodge

    if (this.application.value) {
      this.application.value.year = this.yearToLodge.value
      this.setContent()
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAnnualReturnRequestRepository.fetch(id)
    if (!this.companyAnnualReturnRequestRepository.error && response !== null) {
      this.application.value = new CompanyAnnualReturnRequest(response)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.application.value.companyId)
      this.application.value.company = new Company(companyResponse)
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAnnualReturnRequest()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.year = this.yearToLodge.value
    }
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
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

  getContent(): string {
    if (!this.documentTemplate) {
      return ""
    }

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

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

  override async updateApplicationContent(updatedApplicationData: CompanyAnnualReturnRequest): Promise<void> {
    if (!this.application.value) {
      this.application.value = new CompanyAnnualReturnRequest()
    }

    this.application.value.cloneDetails(updatedApplicationData)
    this.setContent()
    await this.getPersonsToSign()
  }
}
