import { SignatureItem } from "~/scripts/types/SignatureItem"
import { Application } from "~/scripts/models/Application"
import { useDirectorStore } from "~/stores/Directors"
import { useShareholderStore } from "~/stores/Shareholders"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { Shareholder } from "~/scripts/models/Shareholder"
import { useDayjs } from "#imports"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { StatusConstants } from "~/scripts/constants/Status"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export abstract class OpenBankAccountResolutionController<T> {
  companyId: Ref<string> = ref<string>("")
  application = ref<T | null>(null)
  applicationClassType: new (data: any) => T
  isDcr = ref<boolean>(true)
  isMcr = ref<boolean>(false)
  signatureItems = ref<SignatureItem[]>([])
  isLoading = ref<boolean>(false)
  currentUser: User = new User()

  dayjs = useDayjs()
  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()

  emitEvents: any | null = null

  resolutionContent = ref<string>("")
  originalResolutionContent = ref<string>("")

  resolutionContentRef: any | null = null
  documentRef: any | null = null

  excludeResigningDirectors: boolean = false

  isInPreviewMode = ref<boolean>(false)
  isGettingPdfPages = ref<boolean>(false)

  signatureStartOnPage = ref<number>(1)
  maxSignatureOnFirstPage = ref<number>(2)
  maxSignatureOnOtherPages = ref<number>(6)

  showWatermark = ref<boolean>(false)
  watermarkText = ref<string>("preview")

  constructor(
    companyId: string,
    application: T | null,
    applicationClassType: new (data: any) => T,
    isInPreviewMode: boolean,
    showWatermark: boolean,
    watermarkText: string,
    emitEvents: any | null,
    excludeResigningDirectors: boolean = false
  ) {
    this.applicationClassType = applicationClassType
    this.application.value = new this.applicationClassType(application)
    this.emitEvents = emitEvents
    this.excludeResigningDirectors = excludeResigningDirectors

    this.companyId.value = companyId
    this.setIsInPreviewMode(isInPreviewMode)
    this.setShowWatermark(showWatermark)
    this.setWatermarkText(watermarkText)
    this.setCurrentUser()
  }

  initializeData(): void {
    this.getPersonsToSign()
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId
  }

  async setCurrentUser(): Promise<void> {
    this.currentUser = await CurrentUser.get()
  }

  setResolutionContentRef(resolutionContentRef: any | null): void {
    this.resolutionContentRef = resolutionContentRef
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode

    this.signatureItems.value.forEach((signatureItem: SignatureItem) => {
      signatureItem.isSignatureEditable = !this.isInPreviewMode.value
    })
  }

  setShowWatermark(showWatermark: boolean): void {
    this.showWatermark.value = showWatermark
  }

  setWatermarkText(watermarkText: string): void {
    this.watermarkText.value = watermarkText
  }

  companyName(): string {
    if (!this.application.value?.company) {
      return ""
    }

    return this.application.value.company.getFullName()
  }

  registrationNumberOld(): string {
    if (!this.application.value?.company) {
      return ""
    }

    return this.application.value.company.registrationNumberOld
  }

  registrationNumberNew(): string {
    if (!this.application.value?.company) {
      return ""
    }

    return this.application.value.company.registrationNumberNew
  }

  resolutionTitle(): string {
    let title = ""
    if (this.isDcr.value) {
      title = `DIRECTORS' RESOLUTION IN WRITING PURSUANT TO`
    } else {
      title = "MEMBERS’ WRITTEN RESOLUTION PASSED PURSUANT TO"
    }

    if (this.application.value?.company && this.application.value.company.hasConstitution) {
      title = `${title} COMPANY'S CONSTITUTION`
    } else {
      if (this.isDcr.value) {
        title = `${title} PARAGRAPH 15 OF THE THIRD SCHEDULE OF THE COMPANIES ACT 2016`
      } else {
        title = `${title} SECTION 297 OF THE COMPANIES ACT 2016`
      }
    }

    return title
  }

  isResolutionInDraft(): boolean {
    return (
      !this.application.value ||
      StringUtil.isNullOrEmpty(this.application.value.id) ||
      this.application.value.status === StatusConstants.DRAFT
    )
  }

  signatureTitle(): string {
    const typeOfSignatures = this.isDcr.value ? "Director" : "Member"

    const title = this.signatureItems.value.length > 0 ? "Board of" : "Sole"
    return this.signatureItems.value.length > 0 ? `${title} ${typeOfSignatures}s` : `${title} ${typeOfSignatures}`
  }

  isSignatureEditable(email: string): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return this.currentUser.email === email
    }

    return (
      !this.application.value.signatureGroups.some((sg: SignatureGroup) => {
        return sg.email === this.currentUser.email
      }) &&
      this.currentUser.email === email &&
      !this.isInPreviewMode.value
    )
  }

  hasSigned(email: string): boolean {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return false
    }

    return this.application.value.signatureGroups.some((sg: SignatureGroup) => {
      return sg.email === email
    })
  }

  signatureFile(email: string): string | null {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return null
    }

    const signatureGroup = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
      return sg.email === email
    })

    return signatureGroup?.signature?.url ?? null
  }

  async getPersonsToSign(): Promise<void> {
    if (!this.application.value || !this.application.value?.companyId) {
      return
    }

    if (this.isDcr.value) {
      await this.directorRepository.fetchAllForCompany(this.application.value.companyId)
      this.signatureItems.value = this.directorRepository.directors
        .filter((d: Director) => {
          if (!this.excludeResigningDirectors) {
            return true
          }

          return !new Director(d).isResignationInProgress
        })
        .map((d: Director) => {
          return new SignatureItem(
            this.signatureFile(d.email),
            this.hasSigned(d.email),
            this.isSignatureEditable(d.email),
            false,
            d.name,
            d.email,
            "Director"
          )
        })
    } else {
      await this.shareholderRepository.fetchAllForCompany(this.application.value?.companyId)
      this.signatureItems.value = this.shareholderRepository.shareholders.map((s: Shareholder) => {
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
          this.signatureFile(s.email),
          this.hasSigned(s.email),
          this.isSignatureEditable(s.email),
          s.email !== this.currentUser.email,
          s.name,
          s.email,
          role
        )
      })
    }
  }

  haveAllSigned(): boolean {
    return this.signatureItems.value.every((si: SignatureItem) => {
      return si.hasSigned
    })
  }

  resolutionDate(): string {
    if (!this.application.value || this.application.value.signatureGroups.length <= 0 || !this.haveAllSigned()) {
      return "To be determined"
    }

    const latestDate = this.application.value.signatureGroups
      .map((sg: SignatureGroup) => {
        return sg.createdAt
      })
      .reduce((latest: string | null, current: string | null) => {
        if (!latest) {
          return current
        }
        return this.dayjs(current).isAfter(this.dayjs(latest)) ? current : latest
      }, null)

    return latestDate ? this.dayjs(latestDate).format("D MMMM YYYY") : "To be determined"
  }

  getSignatureOnPage(
    page: number,
    signatureStartPage: number,
    maxOnFirstPage: number,
    maxOnOtherPages: number
  ): SignatureItem[] {
    if (page < signatureStartPage) {
      return []
    }

    if (page === signatureStartPage) {
      return this.signatureItems.value.slice(0, maxOnFirstPage)
    }

    const skip = (page - 1) * maxOnOtherPages + maxOnFirstPage
    const lastIndex = Math.min(this.signatureItems.value.length - 1, skip + maxOnOtherPages)

    return this.signatureItems.value.slice(skip, lastIndex)
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (!this.application.value) {
      return false
    }

    if (this.application.value && this.application.value.signatureGroups.length > 0) {
      return false
    }

    return (
      this.application.value &&
      (StringUtil.isNullOrEmpty(this.application.value.id) ||
        this.application.value.status === StatusConstants.DRAFT ||
        this.application.value.status === StatusConstants.PENDING ||
        this.application.value.status === StatusConstants.PAID)
    )
  }

  getApplication(): T | null {
    if (!this.resolutionContentRef) {
      return new this.applicationClassType(this.application.value)
    }

    const copyApplication = this.application.value as any // Handling dynamicity and escape ts type issues
    const container = this.resolutionContentRef as HTMLElement

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

      this.application.value = new this.applicationClassType(copyApplication)
    }

    return new this.applicationClassType(this.application.value)
  }

  async updateApplicationContent(updatedApplicationData: T): Promise<void> {
    this.application.value.cloneDetails(updatedApplicationData)
    await this.getPersonsToSign()
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isGettingPdfPages.value = true

    let originalResolutionContent = this.resolutionContent.value
    if (!StringUtil.isNullOrEmpty(this.resolutionContent.value)) {
      let templateProcessor = new TemplateProcessor(null)
      this.resolutionContent.value = templateProcessor.replaceInputsWithValues(this.resolutionContent.value)
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    this.resolutionContent.value = originalResolutionContent

    this.isGettingPdfPages.value = false

    return pdfPages
  }

  abstract totalPages(): number

  get resolutionProps() {
    return new PropsResolution(
      this.companyName(), //companyName
      this.registrationNumberOld(), //registrationNumberOld
      this.registrationNumberNew(), //registrationNumberNew
      this.resolutionTitle(), //resolutionTitle
      "", //resolutionName
      this.signatureTitle(), //signatureTitle
      this.signatureItems.value, //signatureItems
      this.resolutionDate(), //resolutionDate
      this.totalPages(), //totalPages
      this.signatureStartOnPage.value, //signatureStartOnPage
      this.maxSignatureOnFirstPage.value, //maxSignatureOnFirstPage
      this.maxSignatureOnOtherPages.value, //maxSignatureOnOtherPage
      false, //hasAccompanyingDocument
      this.isDcr.value, //isDcr
      this.showWatermark.value, //showWatermark
      this.watermarkText.value, //watermarkText
      [], //contentPages
      true, //isUsingTemplate
      this.isLoading.value, //isLoading
      true, //isSignatureTinted
      "Wet Ink Required" //signatureTintLabel
    )
  }
}
