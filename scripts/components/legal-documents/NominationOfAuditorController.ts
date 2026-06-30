import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { User } from "~/scripts/models/User"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { Error } from "~/scripts/library/Error"
import { ObjectUtil } from "~/scripts/utils/Object"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"

export class NominationOfAuditorController extends SdnBhdLegalDocumentController {
  isLoading: Ref<boolean> = ref<boolean>(false)

  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyAuditorAppointment>(new CompanyAuditorAppointment())
  currentUser = ref<User>(new User())

  directorRepository = useDirectorStore()
  documentTemplateRepository = useDocumentTemplateStore()

  language = useLanguage()

  directors = ref<Director[]>([])

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, true, false, "", "", "Director"))
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  letterContent = ref<string>("")
  letterHeader = ref<string>("")
  letterTitle = ref<string>("")
  originalTemplateTitle: string = ""
  originalTemplateContent: string = ""

  private documentTemplateId: string = "1435a794-36ef-4c8b-9cb0-58b9dea307dd"

  emitEvents: any | null = null

  constructor(companyId: string, applicationId: string, isInPreviewMode: boolean, emitEvents: any) {
    super("Nomination of Auditors", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents

    this.isInPreviewMode.value = isInPreviewMode

    this.initializeData(applicationId)
  }

  async initializeData(applicationId: string): Promise<void> {
    this.isLoading.value = true
    this.currentUser.value = await CurrentUser.get()

    await Promise.all([this.initializeApplication(applicationId), this.fetchDocumentTemplate()])

    this.isLoading.value = false
  }

  async initializeApplication(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await Promise.all([this.fetchApplication(), this.setApplication()])

    await this.setSignatureItem()
    this.setContent()
  }

  override setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode
    this.setSignatureItem()
    this.setContent()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      let repository = useCompanyAuditorAppointmentStore()
      let response = await repository.fetch(this.applicationId.value)
      if (!response || repository.error !== null) {
        return
      }

      this.application.value = new CompanyAuditorAppointment(response)
    } catch (e) {
      this.application.value = new CompanyAuditorAppointment()
    }
  }

  async setApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value) || !StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      let response = await this.companyRepository.fetch(this.companyId.value)
      if (!response) {
        return
      }

      this.application.value = new CompanyAuditorAppointment()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    } catch (e) {
      this.application.value = new CompanyAuditorAppointment()
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
      this.originalTemplateTitle = this.documentTemplate.value.title
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

  async setSignatureItem(): Promise<void> {
    if (this.directors.value.length <= 0) {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      this.directors.value = response.map((d: any) => {
        return new Director(d)
      })
    }

    if (this.application.value.signatureGroups.length > 0) {
      // take the first signature
      let sortedSignature = ObjectUtil.sort<SignatureGroup>(this.application.value.signatureGroups, "createdAt", "asc")

      let firstSignature = sortedSignature[0]
      let signatureUrl = firstSignature.signature?.url ?? null
      let hasSigned = signatureUrl !== null
      let isEditable = !hasSigned && this.currentUser.value.email === firstSignature.email

      let director = this.directors.value.find((d: Director) => {
        return d.email === firstSignature.email
      })
      let name = director?.name ?? "Director"

      this.signatureItem.value = new SignatureItem(
        signatureUrl,
        hasSigned,
        isEditable,
        false,
        name,
        firstSignature.email,
        "Director"
      )
      return
    }

    let nameOfDirectorToSign = this.isADirector ? this.currentUser.value.name : this.directors.value[0].name
    let emailOfDirectorToSign = this.isADirector ? this.currentUser.value.email : this.directors.value[0].email
    let isEditable = this.isADirector

    this.signatureItem.value = new SignatureItem(
      null,
      false,
      isEditable,
      false,
      nameOfDirectorToSign,
      emailOfDirectorToSign,
      "Director"
    )
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return this.application.value.signatureGroups.length <= 0
  }

  setContent(): void {
    this.letterContent.value = this.getContent()
    this.letterHeader.value = this.getHeader()
    this.letterTitle.value = this.getTitle()
  }

  getHeader(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getHeader(this.company.value)
  }

  getTitle(): string {
    this.documentTemplate.value.title = this.originalTemplateTitle

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (StringUtil.isNullOrEmpty(this.application.value.auditorPartnerId)) {
      return templateProcessor.getTitleForPreview(this.application.value)
    }

    return templateProcessor.getTitleForPrint(this.application.value)
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    let content = this.isDocumentEditable()
      ? templateProcessor.getContentForPreview(this.application.value)
      : templateProcessor.getContentForPrint(this.application.value)

    return content
  }

  setApplicationData(application: CompanyAuditorAppointment): void {
    this.application.value = new CompanyAuditorAppointment(application)

    this.setContent()
  }

  get isADirector(): boolean {
    return this.directors.value.some((d: Director) => {
      return d.email === this.currentUser.value.email
    })
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Surat Penamaan" : "Letter of Nomination"
  }
}
