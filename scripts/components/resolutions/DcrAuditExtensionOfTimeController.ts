import { CompanyAuditExtensionOfTime } from "~/scripts/models/CompanyAuditExtensionOfTime"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAuditExtensionOfTimeController extends ResolutionController<CompanyAuditExtensionOfTime> {
  companyAuditExtensionOfTimeRepository = useCompanyAuditExtensionOfTimeStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  resolutionContent = ref<string>("")
  financialPeriodId = ref<string>("")

  originalTemplateContent: string = ""

  private documentTemplateId: string = "9ebf09d5-6540-4b2b-837c-fd0ad3632b03"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyAuditExtensionOfTime>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAuditExtensionOfTime,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.financialPeriodId.value = props.financialPeriodId ?? ""

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnOtherPages.value = 4
    this.maxSignatureOnFirstPage.value = 6
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
    } else {
      await this.fetchApplication(id ?? "")
    }

    nextTick(() => {
      this.setContent()
    })
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAuditExtensionOfTimeRepository.fetch(id)
    if (!this.companyAuditExtensionOfTimeRepository.error && response !== null) {
      this.application.value = new CompanyAuditExtensionOfTime(response)
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
      this.application.value = new CompanyAuditExtensionOfTime()
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
    //do nothing
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let auditedOrUnaudited = this.application.value?.financialPeriod.isSubmittingAudited ? "Audited" : "Unaudited"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "$text.&lt;name=auditOrUnaudited&gt;$",
      auditedOrUnaudited.toUpperCase()
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
}
