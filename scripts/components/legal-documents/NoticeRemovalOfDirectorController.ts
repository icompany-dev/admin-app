import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { User } from "~/scripts/models/User"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { ObjectUtil } from "~/scripts/utils/Object"
import { CurrentUser } from "~/scripts/utils/CurrentUser"

export class NoticeRemovalOfDirectorController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyDirectorRemoval>(new CompanyDirectorRemoval())
  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  currentUser = ref<User>(new User())
  signatureItems = ref<SignatureItem[]>([])

  repository = useCompanyDirectorRemovalStore()
  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  private documentTemplateId: string = "51dceb96-5ec8-4549-bcee-3dc34f67d3b3"
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  documentHeader: Ref<string> = ref<string>("")
  documentTitle: Ref<string> = ref<string>("")
  documentContent: Ref<string> = ref<string>("")
  originalDocumentContent: string = ""

  additionalCssClass: string = "legal-document print notice-removal-of-director"

  signatureStartOnPage: number = 1
  maxOnFirstPage: number = 6
  maxSignatureOnPage: number = 8

  documentRef: any | null = null

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any) {
    super("NoticeRemovalOfDirector", companyId, PaperOrientation.Portrait)

    this.emitEvents = emitEvents
    this.setIsInPreviewMode(isInPreviewMode)
    this.applicationId.value = applicationId ?? ""
    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      this.currentUser.value = await CurrentUser.get()
      await Promise.all([this.initializeCompanyData(), this.fetchDocumentTemplate()])
      await this.initializeDocument()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.initializeDocument()
  }

  async initializeCompanyData(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    await Promise.all([this.fetchCompany(), this.fetchDirectors(), this.fetchShareholders()])

    this.setHeader()
    this.setTitle()
  }

  async initializeDocument(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.setApplication()
    } else {
      await this.fetchApplication()
    }

    this.setContent()
    this.setSignatureItems()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.setApplication()
      return
    }

    let response = await this.repository.fetch(this.applicationId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    if (!response) {
      this.setApplication()
      return
    }

    this.application.value = new CompanyDirectorRemoval(response)
  }

  setApplication(): void {
    this.application.value = new CompanyDirectorRemoval()
    this.application.value.companyId = this.companyId.value
  }

  async fetchDirectors(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)

    if (this.directorRepository.error !== null) {
      throw this.directorRepository.error
    }

    this.directors.value = response.map((d: Director) => {
      return new Director(d)
    })
  }

  async fetchShareholders(): Promise<void> {
    let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)

    if (this.shareholderRepository.error !== null) {
      throw this.shareholderRepository.error
    }

    this.shareholders.value = response.map((s: Shareholder) => {
      return new Shareholder(s)
    })
  }

  setSignatureItems(): void {
    this.signatureItems.value = this.shareholders.value.map((s: Shareholder) => {
      let signatureGroup = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
        return sg.group?.target === "shareholder" && sg.email === s.email
      })

      let signatureUrl = signatureGroup?.signature?.url ?? null
      let isSignatureEditable =
        signatureUrl === null && s.email === this.currentUser.value.email && !this.isInPreviewMode.value

      let role = "Member"
      if (s.type === "representative" && s.company !== null) {
        let shareholderCompany = new Company(s.company)
        let companyDetails = shareholderCompany.getFullName()
        if (!StringUtil.isNullOrEmpty(shareholderCompany.registrationNumberOld)) {
          companyDetails = `${shareholderCompany.getFullName() ?? ""} (${shareholderCompany.registrationNumberOld})`
        }

        role = `Corporate Representative of<br><b>${companyDetails.toUpperCase()}</b>`
      }

      return new SignatureItem(
        signatureUrl,
        signatureUrl !== null,
        isSignatureEditable,
        false,
        s.name,
        s.email,
        role,
        false
      )
    })
  }

  async fetchDocumentTemplate(): Promise<void> {
    let repository = useDocumentTemplateStore()
    let response = await repository.fetch(this.documentTemplateId)

    if (repository.error !== null) {
      this.documentTemplate.value = new DocumentTemplate()
      this.originalDocumentContent = ""

      throw repository.error
    }

    this.documentTemplate.value = new DocumentTemplate(response)
    this.originalDocumentContent = this.documentTemplate.value.content
  }

  setHeader(): void {
    this.documentHeader.value = this.getHeader()
  }

  getHeader(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getHeader(this.company.value)
  }

  setTitle(): void {
    this.documentTitle.value = this.getTitle()
  }

  getTitle(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getTitle(this.company.value)
  }

  setContent(): void {
    this.documentContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalDocumentContent

    //We/I
    let weOrIStringToReplace = "$text.&lt;name=iOrWe&gt;$"
    let weOrIString = this.shareholders.value.length > 1 ? "We" : "I"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(weOrIStringToReplace, weOrIString)

    //shareholder(s)
    let shareholderStringToReplace = "$text.&lt;name=shareholderOrShareholders&gt;$"
    let shareholderString = this.shareholders.value.length > 1 ? "shareholders" : "shareholder"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      shareholderStringToReplace,
      shareholderString
    )

    //directorName
    let directorNameStringToReplace = "$text.&lt;name=nameOfDirector&gt;$"
    let directorString = this.getDirectorOptions()
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      directorNameStringToReplace,
      directorString
    )

    //andCompanyConstitution
    let companyConstitutionStringToReplace = " $text.&lt;name=andCompanyConstitution&gt;$"
    let andCompanyConstitutionString = this.company.value.hasConstitution ? " and the Constitution of the Company" : ""
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      companyConstitutionStringToReplace,
      andCompanyConstitutionString
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  getDirectorOptions(): string {
    if (this.isInPreviewMode.value) {
      return '<span class="value-placeholder">NAME OF DIRECTOR</span>'
    }

    if (!this.isDocumentEditable()) {
      return this.directorName
    }

    let options = this.directors.value.map((d: Director) => {
      let selected = d.id === this.application.value.directorId
      return `
        <option value='${d.id}' ${selected ? "selected" : ""}>
          ${d.name}
        </option>
      `
    })

    return `
      <select name='directorId' class='form-control in-resolution'>
        ${options.join("")}
      </select>
    `
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return this.application.value.status === StatusConstants.PAID && this.application.value.signatureGroups.length <= 0
  }

  signatureOnPage(page: number): SignatureItem[] {
    if (page === 0) {
      return this.signatureItems.value.slice(0, this.maxOnFirstPage)
    }

    let start = (page - 1) * this.maxSignatureOnPage + this.maxOnFirstPage
    let end = start + this.maxSignatureOnPage

    return this.signatureItems.value.slice(start, end)
  }

  getApplication(): CompanyDirectorRemoval {
    if (!this.documentRef) {
      return new CompanyDirectorRemoval(this.application.value)
    }

    const copyApplication = this.application.value as any // Handling dynamicity and escape ts type issues
    const container = this.documentRef as HTMLElement

    let inputFields = container.querySelectorAll(".form-control") // get all inputs
    if (inputFields.length > 0) {
      inputFields.forEach((element: Element) => {
        if (this.application.value === null) {
          return
        }

        if (element.tagName !== "INPUT" && element.tagName !== "TEXTAREA" && element.tagName !== "SELECT") {
          return
        }

        let input = element as HTMLInputElement

        let name = input.name
        if (name in this.application.value) {
          copyApplication[name] = input.value
        }
      })

      this.application.value = new CompanyDirectorRemoval(copyApplication)
    }

    return new CompanyDirectorRemoval(this.application.value)
  }

  updateApplicationContent(application: CompanyDirectorRemoval): void {
    if (!application) {
      return
    }

    this.application.value = new CompanyDirectorRemoval(application)
    this.setContent()
    this.setSignatureItems()
  }

  get directorName(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.directorId)) {
      return "NAME OF DIRECTOR"
    }

    let matchedDirector =
      this.directors.value.find((d: Director) => {
        return d.id === this.application.value.directorId
      }) ?? null

    return matchedDirector?.name ?? "NAME OF DIRECTOR"
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Notice of Removal of Director"
  }

  get noticeDate(): string {
    if (this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>NOTICE DATE</span>`
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return `<span class='value-placeholder'>NOTICE DATE</span>`
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(
      this.application.value.signatureGroups,
      "createdAt",
      "asc"
    )
    let time = useLocalTime()

    return time.formatDateOnlyFull(orderedSignatureGroups[0].createdAt ?? "")
  }

  get totalPages(): number {
    return this.signaturePages.length
  }

  get signaturePages(): number[] {
    let length = Math.ceil(this.shareholders.value.length / this.maxSignatureOnPage)

    return Array.from({ length: length }, (_, i) => i)
  }
}
