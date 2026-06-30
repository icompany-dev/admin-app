import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { CompanyNotifyChangeOfName } from "~/scripts/models/CompanyNotifyChangeOfName"
import { StringUtil } from "~/scripts/utils/String"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { Error } from "~/scripts/library/Error"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { StatusConstants } from "~/scripts/constants/Status"
import { User } from "~/scripts/models/User"
import { Director } from "~/scripts/models/Director"
import { CurrentUser } from "~/scripts/utils/CurrentUser"

export class NotifyBankChangeOfCompanyNameController extends SdnBhdLegalDocumentController {
  previousCompanyName: Ref<string> = ref<string>("")
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyNotifyChangeOfName>(new CompanyNotifyChangeOfName())

  previousName: Ref<string> = ref<string>("")
  emitEvents: any | null = null

  user = ref<User>(new User())
  isLoading: Ref<boolean> = ref<boolean>(false)

  directors = ref<Director[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  documentHeader = ref<string>("")
  documentTitle = ref<string>("")
  documentContent = ref<string>("")
  originalHeader = ref<string>("")
  originalTitle = ref<string>("")
  originalContent = ref<string>("")

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "DIRECTOR", false))

  language = useLanguage()

  private documentTemplateId: string = "9381e900-c3b5-450c-ae53-7b95dbd814c7"

  constructor(
    companyId: string,
    applicationId: string | null,
    previousName: string,
    isInPreviewMode: boolean,
    emitEvents: any
  ) {
    super("Notify Bank on Change of Name", companyId, PaperOrientation.Portrait)

    this.previousName.value = previousName
    this.applicationId.value = applicationId ?? ""
    this.setIsInPreviewMode(isInPreviewMode)
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    this.isLoading.value = true
    if (this.isFetchingCompany.value) {
      setTimeout(() => {
        this.init()
      }, 200)
      return
    }

    try {
      this.user.value = await CurrentUser.get()
      await Promise.all([this.fetchDirectors(), this.fetchDocumentTemplate()])
      await this.setApplication()
      this.setContent()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setApplication(): Promise<void> {
    await this.fetchApplication()

    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value.companyId = this.companyId.value
      this.application.value.company = this.company.value
      this.application.value.previousName = this.previousName.value
      this.application.value.status = StatusConstants.PAID
      this.application.value.currentName = this.companyName()
      this.application.value.registrationNumber = `${this.registrationNumberNew()} (${this.registrationNumberOld()})`

      let matchedDirector = this.directors.value.find((d: Director) => {
        return d.email === this.user.value.email
      })

      this.application.value.directorName = matchedDirector?.name ?? this.directors.value[0].name
    }

    this.signatureItem.value.name = this.application.value.directorName
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    if (applicationId === this.applicationId.value) {
      return
    }

    this.applicationId.value = applicationId ?? ""
    await this.setApplication()
  }

  setPreviousName(previousName: string): void {
    this.previousName.value = previousName

    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value.previousName = this.previousName.value
    }

    this.setContent()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value = new CompanyNotifyChangeOfName()
      return
    }

    let repository = useCompanyNotifyChangeOfNameStore()
    let response = await repository.fetch(this.applicationId.value)
    this.application.value = new CompanyNotifyChangeOfName(response)
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let repository = useDocumentTemplateStore()
      let response = await repository.fetch(this.documentTemplateId)
      if (repository.error) {
        throw repository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTitle.value = this.documentTemplate.value.title
      this.originalHeader.value = this.documentTemplate.value.header
      this.originalContent.value = this.documentTemplate.value.content
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

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  setContent(): void {
    this.documentHeader.value = this.getHeader()
    this.documentTitle.value = this.getTitle()
    this.documentContent.value = this.getContent()
  }

  getHeader(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    return templateProcessor.getHeader(this.company.value)
  }

  getTitle(): string {
    this.documentTemplate.value.title = this.originalTitle.value

    if (this.isInPreviewMode.value) {
      this.documentTemplate.value.title = this.documentTemplate.value.title.replace(
        "%bankName%",
        '<span class="value-placeholder">YOUR BANK NAME</span>'
      )
    }

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getTitleForPreview(this.application.value)
    }

    if (!this.isDocumentEditable()) {
      return templateProcessor.getTitleForPrint(this.application.value)
    }

    return templateProcessor.getTitle(this.application.value)
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING &&
      this.application.value.signatureGroups.length <= 0
    )
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Surat Anda" : "Letter"
  }
}
