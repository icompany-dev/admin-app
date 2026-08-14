import { NameReservationEmailTypes } from "~/scripts/constants/NameReservations"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { Error } from "~/scripts/library/Error"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { CompanyNameReservation } from "~/scripts/models/CompanyNameReservation"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class Section28ChangeOfNameController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyNameReservation>(new CompanyNameReservation())
  changeOfName = ref<CompanyAmendmentName>(new CompanyAmendmentName())
  applicant = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()

  isDownloading: Ref<boolean> = ref<boolean>(false)
  documentRef: any | null = null

  additionalCssClass: string = "section-28"

  isNoticeChangeOfName: Ref<boolean> = ref<boolean>(false)
  isDirectionOfChangeOfName: Ref<boolean> = ref<boolean>(false)

  resolutionDate: Ref<string> = ref<string>("")
  signatureDate: Ref<string> = ref<string>("")

  cosecName: string = SecretaryInformation.SECRETARY_NAME_LIST[0].name
  nric: string = SecretaryInformation.SECRETARY_NAME_LIST[0].nric
  address: string = SecretaryInformation.SECRETARY_NAME_LIST[0].address.getOnelineAddress()
  phone: string = SecretaryInformation.SECRETARY_NAME_LIST[0].phone
  email: string = SecretaryInformation.SECRETARY_NAME_LIST[0].email

  constructor(applicationId: string, changeOfName: CompanyAmendmentName) {
    this.changeOfName.value = new CompanyAmendmentName(changeOfName)
    this.setApplicationId(applicationId)
  }

  setChangeOfName(changeOfName: CompanyAmendmentName): void {
    this.changeOfName.value = new CompanyAmendmentName(changeOfName)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId

    if (StringUtil.isNullOrEmpty(this.applicationId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      // await this.fetchApplication()
      await this.fetchAmendment()
      await this.fetchApplicant()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchApplication(): Promise<void> {
    let repository = useCompanyNameReservationStore()
    let response = await repository.fetch(this.applicationId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new CompanyNameReservation(response)
  }

  async fetchAmendment(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.application.value.amendmentId)) {
      return
    }

    let repository = useCompanyAmendmentNameStore()
    let response = await repository.fetch(this.application.value.amendmentId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.changeOfName.value = new CompanyAmendmentName(response)
  }

  async fetchApplicant(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.changeOfName.value.initiatorId)) {
      return
    }

    let repository = useUserStore()
    let response = await repository.fetch(this.changeOfName.value.initiatorId ?? "")
    if (repository.error !== null) {
      throw repository.error
    }

    this.applicant.value = new User(response)
  }

  proposedName(): string {
    let name = this.application.value.proposedName.toUpperCase()

    if (this.application.value.nameType === "sdnbhd") {
      name = `${name} SDN.BHD.`
    }

    return name
  }

  applicantIdentificationId(): string {
    if (StringUtil.isNullOrEmpty(this.applicant.value.detail?.identification ?? null)) {
      return "-"
    }

    return this.applicant.value.detail?.identification ?? "-"
  }

  applicantAddress(): string {
    if (!this.applicant.value.detail) {
      return "-"
    }

    return this.applicant.value.detail.location?.getOnelineAddress() ?? "-"
  }

  promoterIdentificationType(): string {
    return this.applicant.value.detail?.identificationType === "passport" ? "Passport" : "NRIC"
  }

  isIdentificationTypeNRIC(): boolean {
    return this.promoterIdentificationType() === "NRIC"
  }

  dateOfBirth(): string {
    if (!this.isIdentificationTypeNRIC()) {
      return "-"
    }

    let identification = this.applicant.value.detail?.identification ?? "-"
    if (identification === "-") {
      return "-"
    }

    let currentYear = this.dayjs().year()
    let firstTwoNumber = currentYear.toString().substring(0, 2)
    let yearOfBirthString = `${firstTwoNumber}${identification.substring(0, 2)}`
    let yearOfBirth = parseInt(yearOfBirthString)
    if (yearOfBirth > currentYear) {
      yearOfBirth = yearOfBirth - 100
    }

    let birthMonth = identification.substring(2, 4)
    let birthDate = identification.substring(4, 2)

    return this.time.formatDateOnlyFull(`${yearOfBirth}-${birthMonth}-${birthDate}`)
  }

  applicationDate(): string {
    return this.time.formatDateOnlyWithSlash(this.application.value.submittedAt)
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    let pages: HTMLElement[] = []
    try {
      this.isDownloading.value = true
      await nextTick()
      pages = await PdfPaperUtil.getPdfElements(this.documentRef)
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      setTimeout(() => {
        this.isDownloading.value = false
      }, 2000)

      return pages
    }
  }

  get nameOptions(): string[] {
    let names: string[] = []
    names.push(this.changeOfName.value.name1?.getCompleteName() ?? "")

    if (this.changeOfName.value.name2) {
      names.push(this.changeOfName.value.name2.getCompleteName())
    }

    if (this.changeOfName.value.name3) {
      names.push(this.changeOfName.value.name3.getCompleteName())
    }

    return names
  }

  get currentName(): string {
    return this.changeOfName.value.currentName
  }

  get newName(): string {
    return this.changeOfName.value.confirmedName?.getCompleteName() ?? ""
  }

  get numberFirst(): string {
    let registrationNumberOld = this.changeOfName.value.company?.registrationNumberOld ?? ""

    if (StringUtil.isNullOrEmpty(registrationNumberOld)) {
      return ""
    }

    let fragments = registrationNumberOld.split("-")

    return fragments[0]
  }

  get checkDigit(): string {
    let registrationNumberOld = this.changeOfName.value.company?.registrationNumberOld ?? ""

    if (StringUtil.isNullOrEmpty(registrationNumberOld)) {
      return ""
    }

    let fragments = registrationNumberOld.split("-")

    return fragments[1] ?? ""
  }

  get formattedResolutionDate(): string {
    if (StringUtil.isNullOrEmpty(this.resolutionDate.value)) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.resolutionDate.value).toUpperCase()
  }

  get formattedSignatureDate(): string {
    if (StringUtil.isNullOrEmpty(this.signatureDate.value)) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.signatureDate.value).toUpperCase()
  }
}
