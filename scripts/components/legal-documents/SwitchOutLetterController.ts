import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"
import { Error } from "~/scripts/library/Error"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class SwitchOutLetterController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  companySwitchOut = ref<CompanySwitchOut>(new CompanySwitchOut())

  emitEvents: any | null = null

  currentUser: Ref<User> = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  additionalCssClass: string = "switch-out-letter"

  time = useLocalTime()

  constructor(companyId: string, applicationId: string | null, emitEvents: any) {
    super("TRANSFER AND HANDOVER OF SECRETARIAL DOCUMENTS", companyId, PaperOrientation.Portrait)

    this.applicationId.value = applicationId ?? ""

    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    try {
      this.isLoading.value = true

      this.currentUser.value = await CurrentUser.get()

      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    this.applicationId.value = applicationId ?? ""

    try {
      this.isLoading.value = true

      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchApplication(): Promise<void> {
    let repository = useCompanySwitchOutStore()
    let response = await repository.fetch(this.applicationId.value)

    this.companySwitchOut.value = new CompanySwitchOut(response)
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    let pages = await PdfPaperUtil.getPdfElements(this.documentRef)
    return pages
  }

  get isPaid(): boolean {
    return (
      this.companySwitchOut.value.status !== StatusConstants.DRAFT &&
      this.companySwitchOut.value.status !== StatusConstants.PENDING
    )
  }

  get isDocumentEditable(): boolean {
    return true
    // if (this.isInPreviewMode.value) {
    //   return false
    // }

    // if (this.companySwitchOut.value.signatureGroups.length > 0) {
    //   return false
    // }

    // return this.isPaid
  }

  get loaderLabel(): string {
    return "Preparing the"
  }

  get loaderSublabel(): string {
    return "Transfer Letter"
  }

  get documentDate(): string {
    if (!this.isPaid) {
      return '<span class="value-placeholder">DOCUMENT DATE</span>'
    }

    if (StringUtil.isNullOrEmpty(this.companySwitchOut.value.paidAt)) {
      return '<span class="value-placeholder">DOCUMENT DATE</span>'
    }

    let paidAt = this.time.formatDateOnlyFull(this.companySwitchOut.value.paidAt ?? "")

    return paidAt
  }

  get newCosecName(): string {
    if (!this.isPaid || StringUtil.isNullOrEmpty(this.companySwitchOut.value.newCosecName)) {
      return "NAME OF YOUR COMPANY SECRETARY"
    }

    return this.companySwitchOut.value.newCosecName.toUpperCase()
  }
}
