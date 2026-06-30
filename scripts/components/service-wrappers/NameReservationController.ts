import { useLanguage } from "#imports"
import { useLocalTime } from "#imports"
import { NameReservationConstants, NameReservationEmailTypes } from "~/scripts/constants/NameReservations"
import { StatusConstants } from "~/scripts/constants/Status"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class NameReservationController {
  applicationIncorporateId: Ref<string> = ref<string>("")
  nameReservationApplicationId: Ref<string> = ref<string>("")
  nameReservationApplication = ref<ApplicationNameReservation>(new ApplicationNameReservation())

  emailType: Ref<string> = ref<string>(NameReservationEmailTypes.Submitted)

  isShowAppealToMinister: Ref<boolean> = ref<boolean>(false)

  isShowEmail: Ref<boolean> = ref<boolean>(true)
  isShowSection27: Ref<boolean> = ref<boolean>(false)

  zoomStep: number = 10 // percent
  currentZoomFactor = ref<number>(100)
  maxZoomFactor: number = 200
  minZoomFactor: number = 10

  showHelp = ref<boolean>(false)
  showOption = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()

  emitEvents: any | null = null

  deleteApplicationRef: any | null = null

  constructor(applicationIncorporateId: string, emitEvents: any | null) {
    this.setApplicationIncorporateId(applicationIncorporateId)
    this.emitEvents = emitEvents
  }

  async setApplicationIncorporateId(applicationIncorporateId: string): Promise<void> {
    this.applicationIncorporateId.value = applicationIncorporateId
    await this.fetchApplication()
  }

  setDeleteApplicationRef(deleteApplicationRef: any): void {
    this.deleteApplicationRef = deleteApplicationRef
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationIncorporateId.value)) {
      this.nameReservationApplicationId.value = ""
      return
    }

    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.applicationIncorporateId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    let application = new ApplicationIncorporate(response)
    if (application.nameReservationApplications.length <= 0) {
      return
    }

    let nameReservationApplications = ObjectUtil.sort<ApplicationNameReservation>(
      application.nameReservationApplications,
      "createdAt",
      "desc"
    )
    this.nameReservationApplicationId.value = nameReservationApplications[0].id
    this.nameReservationApplication.value = new ApplicationNameReservation(nameReservationApplications[0])

    this.isShowSection27.value = false
    this.isShowEmail.value = false
    switch (this.nameReservationApplication.value.ssmResult) {
      case NameReservationConstants.RESULT_APPROVED:
        this.emailType.value = NameReservationEmailTypes.Approved
        this.isShowSection27.value = true
        break
      case NameReservationConstants.RESULT_REJECTED:
        this.emailType.value = NameReservationEmailTypes.Rejected
        this.isShowEmail.value = true
        break
      default:
        this.emailType.value = NameReservationEmailTypes.Submitted
        this.isShowEmail.value = true
    }
  }

  hasApplicationFailed(): boolean {
    return (
      this.nameReservationApplication.value.status === StatusConstants.OUTCOME &&
      this.nameReservationApplication.value.ssmResult === NameReservationConstants.RESULT_REJECTED
    )
  }

  canProceedWithIncorporation(): boolean {
    return (
      this.nameReservationApplication.value.status === StatusConstants.OUTCOME &&
      this.nameReservationApplication.value.ssmResult === NameReservationConstants.RESULT_APPROVED
    )
  }

  canZoomIn(): boolean {
    return this.currentZoomFactor.value < this.maxZoomFactor
  }

  canZoomOut(): boolean {
    return this.currentZoomFactor.value > this.minZoomFactor
  }

  onBackClicked(): void {
    this.emitEvents("back")
  }

  onZoomInClicked(): void {
    if (!this.canZoomIn()) {
      return
    }

    this.currentZoomFactor.value += this.zoomStep
  }

  onZoomOutClicked(): void {
    if (!this.canZoomOut()) {
      return
    }

    this.currentZoomFactor.value -= this.zoomStep
  }

  getZoomStyle(): string {
    return `transform: scale(${this.currentZoomFactor.value}%)`
  }

  onHelpClicked(): void {
    this.showHelp.value = !this.showHelp.value
  }

  onOptionClicked(): void {
    this.showOption.value = !this.showOption.value
  }

  onIncorporateNowClicked(): void {
    let router = useRouter()
    router.push(`/incorporation/${this.applicationIncorporateId.value}`)
  }

  onReserveAnotherClicked(): void {
    let router = useRouter()
    router.push(`/incorporation/${this.applicationIncorporateId.value}`)
  }

  onShowAppealToMinisterClicked(): void {
    this.isShowAppealToMinister.value = !this.isShowAppealToMinister.value
  }

  onAppealToMinisterClicked(): void {
    // payment is needed here
  }

  onAbandonClicked(): void {
    if (!this.deleteApplicationRef) {
      return
    }

    this.deleteApplicationRef.show()
  }

  incorporateNowLabel(): string {
    return this.language.isMalay() ? "Pemerbadankan Sekarang" : "Incorporate Now"
  }

  abandonLabel(): string {
    return this.language.isMalay() ? "Tinggalkan Tempahan" : "Abandon Reservation"
  }

  reserveAnotherLabel(): string {
    return this.language.isMalay() ? "Tempah Lain" : "Reserve Another"
  }

  appealLabel(): string {
    return this.language.isMalay() ? "Rayu pada Menteri" : "Appeal to Minister"
  }
}
