import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Bank } from "~/scripts/models/Bank"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { Director } from "~/scripts/models/Director"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { StatusConstants } from "~/scripts/constants/Status"

export class DeclarationBankAccountOpeningMaybankController extends SdnBhdLegalDocumentController {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()
  directorRepository = useDirectorStore()

  directors = ref<Director[]>([])
  signatureItems = ref<SignatureItem[]>([])
  isADirector = ref<boolean>(false)

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  documentContent = ref<string>("")
  originalDocumentContent = ref<string>("")

  signatureStartOnPage = ref<number>(1)
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)

  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  isLoading: Ref<boolean> = ref<boolean>(false)

  private documentTemplateId: string = "e3967198-9908-4ff5-b568-573707b1a963"

  bankId = ref<string>("")
  bank = ref<Bank>(new Bank())

  time = useLocalTime()
  language = useLanguage()

  emitEvents: any | null = null

  constructor(
    companyId: string,
    applicationId: string | null,
    isInPreviewMode: boolean,
    emitEvents: any | null,
    bankId: string = ""
  ) {
    super("DeclarationBankAccountOpeningMaybank", companyId, PaperOrientation.Portrait)
    this.bankId.value = bankId
    this.isInPreviewMode.value = isInPreviewMode
    this.emitEvents = emitEvents

    this.initializeDocument(applicationId, companyId)
  }

  async initializeDocument(applicationId: string | null, companyId: string): Promise<void> {
    this.isLoading.value = true
    await Promise.all([
      this.initializeApplication(applicationId, companyId),
      this.fetchDocumentTemplate(),
      this.fetchDirectors(),
    ])

    await this.setSignatureItems()
    this.setContent()

    this.isLoading.value = false
  }

  async initializeApplication(applicationId: string | null, companyId: string): Promise<void> {
    if (!StringUtil.isNullOrEmpty(applicationId) && applicationId !== null) {
      await this.fetchApplication(applicationId)
    } else {
      await this.setApplication()
    }
  }

  async fetchBank(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.bankId.value)) {
      return
    }

    try {
      let response = await this.bankRepository.fetch(this.bankId.value)
      if (!this.bankRepository.error && response) {
        this.bank.value = new Bank(response)
        if (this.application.value) {
          this.application.value.bank = this.bank.value
        }
      }
    } catch (e) {
      console.error("Failed to fetch bank:", e)
    }
  }

  async fetchDirectors(): Promise<void> {
    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      this.directors.value = response.map((d: Director) => {
        return new Director(d)
      })
    } catch (e) {
      console.error("Failed to fetch directors:", e)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountOpeningRepository.fetch(id)
    if (!this.companyBankAccountOpeningRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountOpening(response)
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
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalDocumentContent.value = this.documentTemplate.value.content
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

  async setSignatureItems(): Promise<void> {
    let user = await CurrentUser.get()
    this.signatureItems.value = this.directors.value.map((d: Director) => {
      let signatureFile =
        this.application.value.signatureGroups.find((sg: SignatureGroup) => {
          return sg.email === d.email
        })?.signature ?? null

      let isSignatureEditable = signatureFile === null && !this.isInPreviewMode.value && d.email === user.email

      return new SignatureItem(
        signatureFile?.url ?? "",
        signatureFile !== null,
        isSignatureEditable,
        false,
        d.name,
        d.email,
        "Director",
        false
      )
    })
  }

  setContent(): void {
    this.documentContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalDocumentContent.value
    let iOrWe = this.directors.value.length > 1 ? "We" : "I"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replaceAll("%iOrWe%", iOrWe)

    let dayjs = useDayjs()
    let stringToReplace = "$text.&lt;name=variationOfAct&gt;$"
    let stringReplacement = dayjs(this.company.value.incorporatedAt).isBefore("2016-01-01")
      ? "Companies Act 1965"
      : "Companies Act 2016"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      stringToReplace,
      stringReplacement
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace("&lt;br&gt;", "<br>")

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = templateProcessor.getContentForPrint(this.application.value)
    }

    template = this.processCustomPlaceholders(template)

    return template
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

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
    } else {
      await this.fetchApplication(id ?? "")
    }
    this.setContent()
  }

  getDirectors(): Director[] {
    return this.directorRepository.directors || []
  }

  updateApplicationContent(application: CompanyBankAccountOpening): void {
    this.application.value = new CompanyBankAccountOpening(application)
    this.setContent()
  }

  totalPages(): number {
    return 1
  }

  isDocumentEditable(): boolean {
    return this.application.value.signatureGroups.length <= 0 && this.application.value.status === StatusConstants.PAID
  }

  signatureTitle(): string {
    const title = this.signatureItems.value.length > 0 ? "Board of" : "Sole"
    return this.signatureItems.value.length > 0 ? `${title} Directors` : `${title} Director`
  }

  getSignatureOnPage(page: number): SignatureItem[] {
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

  loaderLabel(): string {
    return "Preparing"
  }

  loaderSublabel(): string {
    return "Authorised Persons' Declaration"
  }
}
