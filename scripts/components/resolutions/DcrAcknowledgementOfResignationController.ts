import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAcknowledgementOfResignationController extends ResolutionController<CompanyDirectorResignation> {
  companyDirectorResignationRepository = useCompanyDirectorResignationStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")

  private documentTemplateId: string = "2654475f-75da-4a9e-a7b3-0b1a1a268d90"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyDirectorResignation>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDirectorResignation,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents,
      true
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
    let response = await this.companyDirectorResignationRepository.fetch(id)
    if (!this.companyDirectorResignationRepository.error && response !== null) {
      this.application.value = new CompanyDirectorResignation(response)
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
      this.application.value = new CompanyDirectorResignation()
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

  async otherDataInitiation(): Promise<void> {
    // not applicable
  }

  setContent(): void {
    if (this.application.value !== null) {
      this.application.value.directorName = this.application.value?.resigningDirectorName()

      let signature = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
        return sg.group !== null && this.application.value !== null && sg.group.id === this.application.value.directorId
      })
      if (signature) {
        this.application.value.effectiveDate = this.time.formatDateOnlyFull(signature.createdAt ?? "")
      }
    }

    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value)
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

  override isDocumentEditable(): boolean {
    return false
  }
}
