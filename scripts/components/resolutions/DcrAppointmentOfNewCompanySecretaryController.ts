//NOTE: This controller cannot extend ResolutionController due to the fact that it is for Application Switch

import { CompanySecretaryConstants } from "~/scripts/constants/CompanySecretary"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { StatusConstants } from "~/scripts/constants/Status"
import { SwitchConstants } from "~/scripts/constants/Switches"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { CorporateProfileJsonOfficerInfo } from "~/scripts/models/SsmCorporateProfileJsonData"
import { User } from "~/scripts/models/User"
import { Secretary } from "~/scripts/types/Secretary"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class DcrAppointmentOfNewCompanySecretaryController {
  application = ref<ApplicationSwitch>(new ApplicationSwitch())
  isDcr = ref<boolean>(true)
  isMcr = ref<boolean>(false)

  documentRef: any | null = null
  isPrinting = ref<boolean>(false)

  signatureItems = ref<SignatureItem[]>([])
  isLoading = ref<boolean>(false)
  currentUser = ref<User>(new User())

  dayjs = useDayjs()
  repository = useApplicationSwitchStore()

  signatureStartOnPage = ref<number>(1)
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)

  emitEvents: any | null = null

  resolutionContentRef: any | null = null

  documentDate: Ref<string> = ref<string>("")

  selectedCompanySecretary: Ref<Secretary> = ref<Secretary>(SecretaryInformation.SECRETARY_NAME_LIST[0])
  secretaryOptions: Secretary[] = SecretaryInformation.SECRETARY_NAME_LIST

  companySecretaryName: string = CompanySecretaryConstants.NAME
  companySecretaryIC: string = CompanySecretaryConstants.NRIC
  companySecretaryLicense: string = CompanySecretaryConstants.LICENSE
  companySecretarySsmPcNo: string = CompanySecretaryConstants.SSM_PC_NO

  constructor(application: ApplicationSwitch, emitEvents: any | null) {
    this.emitEvents = emitEvents
    this.initializeData(application)
  }

  async initializeData(application: ApplicationSwitch): Promise<void> {
    await this.setCurrentUser()
    this.setApplication(application)
  }

  setApplication(application: ApplicationSwitch): void {
    this.application.value = new ApplicationSwitch(application)
    nextTick(() => {
      this.setSignatureItems()
    })
  }

  async setCurrentUser(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
  }

  setResolutionContentRef(resolutionContentRef: any | null): void {
    this.resolutionContentRef = resolutionContentRef
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  companyName(): string {
    return `${this.application.value.name.toUpperCase()} SDN BHD`
  }

  registrationNumberOld(): string {
    return this.application.value.registrationNumberOld
  }

  registrationNumberNew(): string {
    return this.application.value.registrationNumberNew
  }

  resolutionTitle(): string {
    return "DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO PARAGRAPH 15 OF THE THIRD SCHEDULE OF THE COMPANIES ACT 2016"
  }

  isAppointNew(): boolean {
    return (
      this.application.value.switchType === SwitchConstants.TYPE_VACATED ||
      this.application.value.switchType === SwitchConstants.TYPE_SELF_SERVICE
    )
  }

  isPlaceholder(): boolean {
    return !this.application.value.metadata // Data not available yet
  }

  previousCompanySecretaryName(): string {
    if (!this.application.value.metadata) {
      return "Complete Your Sdn Bhd Details"
    }

    let jsonData = this.application.value.getCorporateProfileData()
    if (!jsonData) {
      return this.application.value.secretaryName
    }

    let secretary = jsonData.officerInfos.find((oi: CorporateProfileJsonOfficerInfo) => {
      return oi.designationCode.toLowerCase() === "s"
    })

    return secretary?.name ?? this.application.value.secretaryName
  }

  previousCompanySecretaryNRIC(): string {
    if (!this.application.value.metadata) {
      return "Complete Your Sdn Bhd Details"
    }

    let jsonData = this.application.value.getCorporateProfileData()
    if (!jsonData) {
      return "-"
    }

    let secretary = jsonData.officerInfos.find((oi: CorporateProfileJsonOfficerInfo) => {
      return oi.designationCode.toLowerCase() === "s"
    })

    return secretary?.idNo ?? "-"
  }

  resolutionName(): string {
    return this.isAppointNew() ? "Appointment of New Company Secretary" : "Change of Company Secretary"
  }

  signatureTitle(): string {
    return this.signatureItems.value.length > 0 ? `Board of Directors` : `Sole Director`
  }

  isSignatureEditable(): boolean {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return false
    }

    if (!this.application.value || this.application.value.signatureGroups.length <= 0) {
      return true
    }

    return !this.application.value.signatureGroups.some((sg: SignatureGroup) => {
      return sg.email === this.currentUser.value.email
    })
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

  setSignatureItems(): void {
    if (!this.application.value.metadata) {
      this.signatureItems.value = [
        new SignatureItem(
          this.signatureFile(this.currentUser.value.email),
          this.hasSigned(this.currentUser.value.email),
          this.isSignatureEditable(),
          this.currentUser.value.email !== this.currentUser.value.email,
          this.currentUser.value.name,
          this.currentUser.value.email,
          "Director"
        ),
      ]

      return
    }

    this.signatureItems.value = this.application.value.directorInvitations.map((di: DirectorInvitation) => {
      return new SignatureItem(
        this.signatureFile(di.email),
        this.hasSigned(di.email),
        this.isSignatureEditable(),
        di.email !== this.currentUser.value.email,
        di.name ?? di.invitationName ?? "Unknown Director",
        di.email,
        "Director"
      )
    })
  }

  haveAllSigned(): boolean {
    return this.signatureItems.value.every((si: SignatureItem) => {
      return si.hasSigned
    })
  }

  resolutionDate(): string {
    let time = useLocalTime()
    let dayjs = useDayjs()

    if (!StringUtil.isNullOrEmpty(this.documentDate.value)) {
      return time.formatDateOnlyFull(this.documentDate.value)
    }

    return time.formatDateOnlyFull(dayjs().format("YYYY-MM-DD"))
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
    return this.application.value.signatureGroups.length <= 0
  }

  totalPages(): number {
    if (this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  onSelectedSecretary(secretary: Secretary): void {
    this.selectedCompanySecretary.value = secretary
  }

  onNameChanged(value: string): void {
    if (this.application.value.name === value) {
      return
    }

    this.application.value.name = value
    this.emitEvents("nameChanged", this.application.value.name)
  }

  onRegistrationNumberNewUpdated(value: string): void {
    if (this.application.value.registrationNumberNew === value) {
      return
    }

    this.application.value.registrationNumberNew = value
    this.emitEvents("registrationNoNewUpdated", this.application.value.registrationNumberNew)
  }

  onRegistrationNumberOldUpdated(value: string): void {
    if (this.application.value.registrationNumberOld === value) {
      return
    }

    this.application.value.registrationNumberOld = value
    this.emitEvents("registrationNoOldUpdated", this.application.value.registrationNumberOld)
  }

  showPlaceholder(): boolean {
    return StringUtil.isNullOrEmpty(this.application.value.id)
  }

  getSecretaryName(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "iCompany Secretary Name"
    }

    return this.selectedCompanySecretary.value.name.toUpperCase()
  }

  getSecretaryIC(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "iCompany Secretary NRIC No."
    }

    return this.selectedCompanySecretary.value.nric
  }

  getSecretaryLicense(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "iCompany Secretary License No."
    }

    return this.selectedCompanySecretary.value.license
  }

  getSecretarySsmPcNo(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.id)) {
      return "iCompany Secretary SSM Pc No."
    }

    return this.selectedCompanySecretary.value.certificate
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    console.log(this.documentRef, "pdfpage")
    if (!this.documentRef.value) {
      return []
    }

    this.isPrinting.value = true

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef.value)

    this.isPrinting.value = false

    return pdfPages
  }
}
