import { NameReservationEmailTypes } from "~/scripts/constants/NameReservations"
import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { User } from "~/scripts/models/User"
import { StringUtil } from "~/scripts/utils/String"

export class Section27OneFourController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<ApplicationNameReservation>(new ApplicationNameReservation())
  applicationIncorporate = ref<ApplicationIncorporate>(new ApplicationIncorporate())
  applicant = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()

  constructor(applicationId: string) {
    this.setApplicationId(applicationId)
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId

    if (StringUtil.isNullOrEmpty(this.applicationId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await this.fetchApplication()
      await this.fetchIncorporation()
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
    let repository = useApplicationNameReservationStore()
    let response = await repository.fetch(this.applicationId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationNameReservation(response)
  }

  async fetchIncorporation(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.application.value.applicationIncorporateId)) {
      return
    }

    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.application.value.applicationIncorporateId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.applicationIncorporate.value = new ApplicationIncorporate(response)
  }

  async fetchApplicant(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationIncorporate.value.applicantId)) {
      return
    }

    let repository = useUserStore()
    let response = await repository.fetch(this.applicationIncorporate.value.applicantId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.applicant.value = new User(response)
  }

  proposedName(): string {
    let name = this.application.value.name.toUpperCase()

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
}
