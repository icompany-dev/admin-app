import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { StringUtil } from "~/scripts/utils/String"
import { BasePopupController } from "./BasePopupController"
import { Error } from "~/scripts/library/Error"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"

export class ReservedNameForNewSdnBhdQueriedController extends BasePopupController {
  applicationNameReservation: Ref<ApplicationNameReservation> = ref<ApplicationNameReservation>(
    new ApplicationNameReservation()
  )

  constructor(applicationNameReservation: ApplicationNameReservation, emitEvents: any) {
    super(emitEvents)
    this.setApplicationNameReservation(applicationNameReservation)

    this.isCompliance.value = false
  }

  setApplicationNameReservation(applicationNameReservation: ApplicationNameReservation): void {
    this.applicationNameReservation.value = new ApplicationNameReservation(applicationNameReservation)
  }

  onProceedClicked(): void {
    if (!this.canProceed) {
      // add toast
      let error = new Error()
      error.setForIncompleteData()
      error.handle()
      return
    }

    this.emitEvents(EmitMessages.PROCEED, this.applicationNameReservation.value)

    this.hide()
  }

  get canProceed(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.applicationNameReservation.value.ssmQueryEn) &&
      !StringUtil.isNullOrEmpty(this.applicationNameReservation.value.ssmQueryBm)
    )
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? "Tempah Nama bagi Sdn Bhd Baharu" : "Reserved Name for New Sdn Bhd"
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan semua maklumat dibawah:
      `
    }

    return `
      Complete the following details:
    `
  }

  get nameLabel(): string {
    return this.language.isMalay() ? "Nama yang Ditempah" : "Reserved Name"
  }

  get queryEnLabel(): string {
    return this.language.isMalay() ? "Kueri SSM (English)" : "SSM Query Remarks (English)"
  }

  get queryBmLabel(): string {
    return this.language.isMalay() ? "Kueri SSM (Bahasa Malaysia)" : "SSM Query Remarks (Bahasa Malaysia)"
  }
}
