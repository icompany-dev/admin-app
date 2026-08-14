import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { CompanyNoConstitutionDeclaration } from "~/scripts/models/CompanyNoConstitutionDeclaration"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { StatusConstants } from "~/scripts/constants/Status"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class NoConstitutionDeclarationController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string | null> = ref<string | null>(null)
  application = ref<CompanyNoConstitutionDeclaration>(new CompanyNoConstitutionDeclaration())

  companyNoConstitutionDeclarationRepository = useCompanyNoConstitutionDeclarationStore()
  documentTemplateRepository = useDocumentTemplateStore()
  templateId: string = "a75e1690-8790-45ce-86e2-dd5da65b48be"
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTitle: Ref<string> = ref<string>("")
  isEditDetails: Ref<boolean> = ref<boolean>(false)

  declarationTitle: Ref<string> = ref<string>("")
  declarationContent: Ref<string> = ref<string>("")

  declarationRef: any | null = null

  emitEvents: any | null = null

  constructor(companyId: string, applicationId: string | null, emitEvents: any | null) {
    super("Notification of No Constitution", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents
    this.init(applicationId)
  }

  async init(applicationId: string | null): Promise<void> {
    await this.fetchDocumentTemplate()
    if (StringUtil.isNullOrEmpty(applicationId)) {
      await this.setApplication()
    } else {
      await this.setApplicationId(applicationId)
    }
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    this.applicationId.value = applicationId
    await this.fetchApplication()

    this.setTitle()
    this.setContent()

    setTimeout(() => {
      this.emitEvents("applicationLoaded")
    }, 1000)
  }

  override async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId
    await this.fetchCompany()
    this.setApplication()

    this.setTitle()
    this.setContent()
  }

  setDeclarationRef(declarationRef: any): void {
    this.declarationRef = declarationRef
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let response = await this.companyNoConstitutionDeclarationRepository.fetch(this.applicationId.value ?? "")
    if (!this.companyNoConstitutionDeclarationRepository.error && response !== null) {
      this.application.value = new CompanyNoConstitutionDeclaration(response)
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyNoConstitutionDeclaration()
    this.application.value.companyId = this.companyId.value
    this.application.value.company = new Company(this.company.value)
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.templateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTitle.value = response.title

      this.setTitle()
      this.setContent()
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

  isPaid(): boolean {
    return !StringUtil.isNullOrEmpty(this.application.value.id)
  }

  documentDate(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.createdAt)) {
      return "To be determined"
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.application.value.createdAt)
  }

  isDocumentEditable(): boolean {
    return this.application.value.status !== StatusConstants.PAID
  }

  onTitleClicked(event: MouseEvent | TouchEvent): void {
    if (!event.target) {
      return
    }

    let target = event.target as HTMLElement
    if (!target.classList.contains("action-link")) {
      return
    }

    this.isEditDetails.value = !this.isEditDetails.value
    this.setTitle()
  }

  getHeader(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getHeader(this.application.value)
  }

  setTitle(): void {
    if (!this.isPaid()) {
      if (this.isEditDetails.value) {
        this.documentTemplate.value.title = this.originalTitle.value
        let addressTo = `
          $text.&lt;name=toWhom&gt;$ <span class='action-link no-print'>Cancel?</span>
        `

        this.documentTemplate.value.title = this.documentTemplate.value.title.replace(
          "$text.&lt;name=toWhom&gt;$",
          addressTo
        )
      } else {
        this.documentTemplate.value.title = this.originalTitle.value
        let addressTo = `To Whom It May Concern <pan class='action-link no-print'>Edit?</span>`

        this.documentTemplate.value.title = this.documentTemplate.value.title.replace(
          "<p>$textarea.&lt;name=toAddress&gt;$</p>",
          ""
        )

        this.documentTemplate.value.title = this.documentTemplate.value.title.replace(
          "$text.&lt;name=toWhom&gt;$",
          addressTo
        )
      }
    } else {
      this.documentTemplate.value.title = this.originalTitle.value
      if (StringUtil.isNullOrEmpty(this.application.value.toWhom)) {
        this.application.value.toWhom = "To Whom It May Concern"
      }
    }

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    this.declarationTitle.value = !this.isPaid()
      ? templateProcessor.getTitle(this.application.value)
      : templateProcessor.getTitleForPrint(this.application.value)
  }

  setContent(): void {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    this.declarationContent.value = !this.isPaid()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)
  }

  paperClasses(): string {
    return this.isPaid()
      ? "print legal-document no-constitution-declaration use-letter-head"
      : "print legal-document no-constitution-declaration"
  }

  async getPaperElements(): Promise<HTMLElement[]> {
    if (!this.declarationRef) {
      return []
    }

    let papers = await PdfPaperUtil.getPdfElements(this.declarationRef)

    // let elements = this.declarationRef.getElementsByClassName("paper")
    // let papers: HTMLElement[] = []

    // for (let i = 0; i < elements.length; i++) {
    //   let element = elements[i] as HTMLElement
    //   if (!element) {
    //     continue
    //   }
    //   papers.push(element)
    // }

    return papers
  }
}
