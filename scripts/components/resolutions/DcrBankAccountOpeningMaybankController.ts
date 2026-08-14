import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { OpenBankAccountResolutionController } from "./OpenBankAccountResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Bank } from "~/scripts/models/Bank"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { Director } from "~/scripts/models/Director"
import _ from "lodash"
import type { SignatureItem } from "~/scripts/types/SignatureItem"

export class DcrBankAccountOpeningMaybankController extends OpenBankAccountResolutionController<CompanyBankAccountOpening> {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  pages = ref<string[]>([])
  resolutionContent = ref<string>("")

  originalTemplateContent: string = ""

  private documentTemplateId: string = "2ba92d6d-dbb3-4551-b096-7c22509d4a9b"

  bankId = ref<string>("")
  bank = ref<Bank>(new Bank())

  selectedBranchId = ref<string>("")

  time = useLocalTime()
  language = useLanguage()

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanyBankAccountOpening | null,
    isInPreviewMode: boolean,
    showWatermark: boolean,
    watermarkText: string,
    emitEvents: any | null,
    bankId: string = ""
  ) {
    super(companyId, application, CompanyBankAccountOpening, isInPreviewMode, showWatermark, watermarkText, emitEvents)
    this.isDcr.value = true
    this.bankId.value = bankId

    this.signatureStartOnPage.value = 3
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6

    this.initializeResolution(applicationId, companyId)
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async initializeApplication(applicationId: string | null, companyId: string): Promise<void> {
    if (!StringUtil.isNullOrEmpty(applicationId) && applicationId !== null) {
      await this.fetchApplication(applicationId)
    } else {
      await this.setApplication()
    }

    this.setContent()
  }

  async initializeResolution(applicationId: string | null, companyId: string): Promise<void> {
    this.isLoading.value = true
    await Promise.all([this.initializeApplication(applicationId, companyId), this.fetchDocumentTemplate()])

    this.setContent()
    this.isLoading.value = false
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
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
      this.application.value = new CompanyBankAccountOpening()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.application.value.bankId = this.bankId.value
      if (this.bank.value?.id) {
        this.application.value.bank = this.bank.value
      }
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

  setContent(): void {
    let splitPages = this.documentTemplate.value.content.split(TemplateProcessor.BREAKPAGE_MARKER)

    this.pages.value = splitPages.map((raw: string) => {
      let p = this.processCustomPlaceholders(raw)
      let mockTemplate = new DocumentTemplate()
      mockTemplate.content = p
      let templateProcessor = new TemplateProcessor(mockTemplate)

      if (this.isInPreviewMode.value) {
        return templateProcessor.getContentForPreview(this.application.value)
      } else {
        return this.isDocumentEditable()
          ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
          : templateProcessor.getContentForPrint(this.application.value)
      }
    })
  }

  getContentPageCount(): number {
    return this.pages.value.length
  }

  processCustomPlaceholders(content: string): string {
    if (!content) {
      return content
    }

    content = content.replace(/%\[([^\]]*)\]%/g, (match, markerText) => {
      if (markerText) {
        return `<span class="fake-marker">${markerText}</span>`
      }
      return `<span class="fake-indent"></span>`
    })

    return content
  }

  getBankName(): string {
    return this.bank.value?.name || ""
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return this.getContentPageCount()
    }

    const contentPageCount = this.getContentPageCount()
    const signaturePages = Math.ceil(
      (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
    )

    return contentPageCount + signaturePages
  }

  getSignatureOnCurrentPage(page: number): SignatureItem[] {
    if (page < this.signatureStartOnPage.value) {
      return []
    }

    if (page === this.signatureStartOnPage.value) {
      return this.signatureItems.value.slice(0, this.maxSignatureOnFirstPage.value)
    }

    const offsetPage = this.signatureStartOnPage.value + 1
    const skip = (page - offsetPage) * this.maxSignatureOnOtherPages.value + this.maxSignatureOnFirstPage.value
    const lastIndex = Math.min(this.signatureItems.value.length, skip + this.maxSignatureOnOtherPages.value)

    return this.signatureItems.value.slice(skip, lastIndex)
  }

  handleEnlargedSignaturePad(isEnlarged: any): void {
    if (isEnlarged) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }
  }

  pageRangeForSignatures(): number[] {
    let startRange = this.pages.value.length + 1
    let length = this.totalPages() - this.pages.value.length
    return Array.from({ length: length }, (_, i) => i + startRange)
  }
}
