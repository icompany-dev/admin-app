import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { SelectOption } from "~/scripts/types/SelectOption"
import {
  DirectorResignationConstants,
  DirectorResignationTypeDescription,
} from "~/scripts/constants/DirectorResignations"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Company } from "~/scripts/models/Company"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class AuditExemptionCertificateController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyDirectorResignation>(new CompanyDirectorResignation())

  directorId: Ref<string> = ref<string>("")
  signatureGroups: Ref<SignatureGroup[]> = ref<SignatureGroup[]>([])

  director: Ref<Director> = ref<Director>(new Director())
  user: Ref<User> = ref<User>(new User())

  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  companyDirectorResignationRepository = useCompanyDirectorResignationStore()
  directorRepository = useDirectorStore()
  dayjs = useDayjs()
  time = useLocalTime()

  emitEvents: any | null = null

  startDate: Ref<string> = ref<string>("")
  endDate: Ref<string> = ref<string>("")
  circulationDate: Ref<string> = ref<string>("")

  constructor(companyId: string, directorId: string, isInPreviewMode: boolean, emitEvents: any | null) {
    super("Resignation as Director", companyId, PaperOrientation.Portrait)

    this.emitEvents = emitEvents
    this.setIsInPreviewMode(isInPreviewMode)
    this.setUser()
    this.setDirectorId(directorId)
  }

  async setUser(): Promise<void> {
    this.user.value = await CurrentUser.get()
  }

  override setIsInPreviewMode(isInPreviewMode: boolean): void {
    this.isInPreviewMode.value = isInPreviewMode
    this.setSignatureItem()
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    this.applicationId.value = applicationId ?? ""
    await this.setApplication()
  }

  async setDirectorId(directorId: string): Promise<void> {
    if (StringUtil.isNullOrEmpty(directorId)) {
      return
    }

    this.directorId.value = directorId
    await this.fetchDirector()
    await this.setApplication()

    await this.setSignatureItem()
  }

  override async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId
    await this.fetchSignatures()
    await this.fetchCompany()
    this.setApplication()
  }

  async setApplication(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.applicationId.value)) {
      await this.fetchApplication()
      return
    }

    this.application.value = new CompanyDirectorResignation()
    this.application.value.companyId = this.companyId.value
    this.application.value.company = new Company(this.company.value)
    this.application.value.directorId = this.directorId.value
    this.application.value.director = new Director(this.director.value)

    this.setSignatureItem()
  }

  async fetchApplication(): Promise<void> {
    await 1
    // if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
    //   return
    // }
    // try {
    //   let response = await this.companyDirectorResignationRepository.fetch(this.applicationId.value)
    //   if (this.companyDirectorResignationRepository.error !== null) {
    //     throw this.companyDirectorResignationRepository.error
    //   }
    //   this.application.value = new CompanyDirectorResignation(response)
    //   this.directorId.value = this.application.value.directorId
    //   await this.fetchDirector()
    //   this.setSignatureItem()
    // } catch (e: any) {
    //   if (e instanceof Error) {
    //     e.handle()
    //   } else {
    //     let error: Error = new Error(
    //       Error.ERROR_TYPE_API,
    //       "Unable to fetch details of application. Please refresh the page and try again."
    //     )
    //     error.handle()
    //   }
    // }
  }

  async fetchDirector(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.directorId.value)) {
      return
    }

    try {
      const response = await this.directorRepository.fetch(this.directorId.value)
      if (this.directorRepository.error !== null) {
        throw this.directorRepository.error
      }
      this.director.value = new Director(response)
    } catch (e: any) {
      console.error(e)
    }
  }

  async fetchSignatures(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useSignatureStore()
    let response = await repository.fetchByGroup(this.companyId.value, "director")
    if (!response) {
      return
    }

    this.signatureGroups.value = response.map((item: any) => {
      return new SignatureGroup(item)
    })
  }

  setSignatureItem(): void {
    let signatureGroup = this.signatureGroups.value.find((sg: SignatureGroup) => {
      return sg.group?.target === "director" && sg.group?.id === this.directorId.value
    })

    let signatureUrl = signatureGroup?.signature?.url ?? null

    this.signatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      false,
      false,
      this.application.value.resigningDirectorName(),
      this.director.value.user?.email ?? this.user.value.email,
      "Director",
      false
    )
  }

  hasDocumentDate(): boolean {
    let signatureGroup = this.signatureGroups.value.find((sg: SignatureGroup) => {
      return sg.group?.target === "director" && sg.group?.id === this.directorId.value
    })

    return signatureGroup !== undefined && signatureGroup !== null
  }

  onTypeClick(type: string): void {
    this.application.value.type = type
  }

  async getLetterPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  getData(): CompanyDirectorResignation {
    return new CompanyDirectorResignation(this.application.value)
  }

  getDisplayDate(dateVal: string, format: string = "D MMMM YYYY"): string {
    return this.dayjs(dateVal).format(format)
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return true
  }

  // copywritings
  letterTitle(): string {
    return `Resignation as Director of ${this.company.value.getFullName()} (Company)`
  }

  dateOfSubmission(): string {
    let signatureOfResigningDirector = this.signatureGroups.value.find((sg: SignatureGroup) => {
      return sg.group?.target === "director" && sg.group?.id === this.directorId.value
    })

    if (!signatureOfResigningDirector || !signatureOfResigningDirector.createdAt) {
      return "Date of Submission"
    }

    return this.time.formatDateOnlyFull(signatureOfResigningDirector.createdAt)
  }

  effectTypes(): SelectOption[] {
    let immediateType: SelectOption = DirectorResignationConstants.TYPE_IMMEDIATE

    immediateType.isSelected = this.application.value.type === DirectorResignationType.Immediate

    let fourteenDaysType: SelectOption = DirectorResignationConstants.TYPE_FOURTEEN_DAYS
    fourteenDaysType.isSelected = this.application.value.type === DirectorResignationType.FourteenDays

    return [immediateType, fourteenDaysType]
  }

  selectedEffectType(): string {
    if (this.application.value.type === DirectorResignationType.FourteenDays) {
      return DirectorResignationTypeDescription.FourteenDays
    }

    return DirectorResignationTypeDescription.Immediate
  }

  registeredAddress(): string {
    let registeredAddress = this.company.value.registeredAddressLocation
    if (!registeredAddress) {
      return `
        D-1-6, BLOCK D, SEKITAR26 ENTERPRISE,<br>
        PERSIARAN HULU SELANGOR, SEKSYEN 26,<br>
        40400 SHAH ALAM,<br>
        SELANGOR MALAYSIA
      `
    }

    return registeredAddress.getMultilineAddress()
  }

  totalPages(): number {
    return 1
  }
}
