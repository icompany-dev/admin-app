import { StringUtil } from "~/scripts/utils/String"
import { BasePopupController } from "./BasePopupController"
import { Error } from "~/scripts/library/Error"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import NameReservationRejected from "~/components/Popups/NameReservationRejected.vue"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import type { IPropsNameReservationRejected } from "~/scripts/props/PropsNameReservationRejected"

export class NameReservationRejectedController extends BasePopupController {
  applicantName: Ref<string> = ref<string>("")
  nameSubmitted: Ref<string> = ref<string>("")

  dateRejected: Ref<string> = ref<string>("")
  reason: Ref<string> = ref<string>("")

  constructor(props: IPropsNameReservationRejected, emitEvents: any | null) {
    super(emitEvents)

    this.setValuesFromProps(props)
  }

  setValuesFromProps(props: IPropsNameReservationRejected): void {
    this.applicantName.value = props.applicantName
    this.nameSubmitted.value = props.nameSubmitted
  }

  override onProceedClicked(): void {
    if (!this.canProceed) {
      // add toast
      let error = new Error()
      error.setForIncompleteData()
      error.handle()
      return
    }

    this.emitEvents(EmitMessages.PROCEED, new NameReservationRejected(this.dateRejected.value, this.reason.value))
  }

  //getters
  get canProceed(): boolean {
    return !StringUtil.isNullOrEmpty(this.dateRejected.value) && !StringUtil.isNullOrEmpty(this.reason.value)
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? "Tempahan Nama Ditolak" : "Reserved Name Rejected"
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        ${this.applicantName.value} akan diberitahu bahawa ${this.nameSubmitted.value} telah ditolak oleh SSM.
        <br><br>
        Sila lengkapkan semua maklumat dibawah.
      `
    }

    return `
      ${this.applicantName.value} will be informed that ${this.nameSubmitted.value} has been rejected by SSM.
      <br><br>
      Please complete the following details.
    `
  }

  get dateRejectedLabel(): string {
    return this.language.isMalay() ? "Tarikh Ditolak" : "Date of Rejection"
  }

  get reasonLabel(): string {
    return this.language.isMalay() ? "Keterangan" : "Reason"
  }
}
