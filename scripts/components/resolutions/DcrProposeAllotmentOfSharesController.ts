import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { ResolutionController } from "./ResolutionController"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { ShareType } from "~/scripts/constants/Shareholder"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrProposeAllotmentOfSharesController extends ResolutionController<CompanyShareIssuance> {
  companyShareIssuanceRepository = useCompanyShareIssuanceStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTemplateContent: string = ""
  resolutionContent = ref<string>("")

  private templateId: string = "cf8c0594-ab09-4335-ae78-15935b55df64"

  type = ref<string>("set")

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyShareIssuance>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyShareIssuance,
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
    let response = await this.companyShareIssuanceRepository.fetch(id)
    if (!this.companyShareIssuanceRepository.error && response !== null) {
      this.application.value = new CompanyShareIssuance(response)
      this.initializeData()
      nextTick(() => {
        this.resolutionContent.value = this.getContent()
      })
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyShareIssuance()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async fetchDocumentTemplates(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.templateId)
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

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    await this.fetchDocumentTemplates()
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent
    if (this.isDocumentEditable()) {
      // Change the content for share type
      let disable = this.isInPreviewMode.value ? "disabled" : ""

      let shareTypes = `
        <select class='form-select in-resolution form-control text-center' ${disable} name="shareType" data-field-name="shareType">
          <option value='${ShareType.Ordinary}' ${this.application.value?.shareType === ShareType.Ordinary ? "selected" : ""}>Ordinary</option>
          <option value='${ShareType.Preference}' ${this.application.value?.shareType === ShareType.Preference ? "selected" : ""}>Preference</option>
        </select> Shares
      `
      let searchString = "$text.&lt;name=shareType&gt;$"
      this.documentTemplate.value.content = this.documentTemplate.value.content.replace(searchString, shareTypes)
    }

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      let content = templateProcessor.getContentForPreview(this.application.value)
      content = content.replace("ordinary_shares", "YOUR SHARE TYPE")
      return content
    }

    let content = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)

    if (!this.isDocumentEditable()) {
      content = content.replace("ordinary_shares", "Ordinary Shares")
      content = content.replace("preference_shares", "Preference Shares")
    }

    return content
  }

  setDataInput(event: Event): void {
    if (!event.target || !this.application.value) {
      return
    }

    let target = event.target as HTMLElement
    if (target.classList.contains("form-select")) {
      let item = event.target as HTMLSelectElement
      if (item.value === ShareType.Preference) {
        this.emitEvents("preferenceShareSelected")
      }
    }
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

  override async updateApplicationContent(updatedApplicationData: CompanyShareIssuance): Promise<void> {
    nextTick(async () => {
      if (!this.application.value) {
        this.application.value = new CompanyShareIssuance()
      }

      this.application.value.cloneDetails(updatedApplicationData)
      this.resolutionContent.value = this.getContent()
      await this.getPersonsToSign()
    })
  }
}
