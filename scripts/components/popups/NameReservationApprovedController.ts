import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class NameReservationApprovedController extends BasePopupController {
  nameReservation = ref<NameReservationVariant>(new NameReservationVariant("", "", null, null))

  constructor(nameReservation: NameReservationVariant, emitEvents: any | null) {
    super(emitEvents)

    this.isCompliance.value = false
    this.setNameReservation(nameReservation)
  }

  setNameReservation(nameReservation: NameReservationVariant): void {
    this.nameReservation.value = new NameReservationVariant(
      nameReservation.name,
      nameReservation.nameType,
      nameReservation.nameDescription,
      nameReservation.supportingDocument
    )
  }

  onProceedClicked(): void {
    this.emitEvents(EmitMessages.PROCEED, this.nameReservation.value)
    this.hide()
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Nama Ditempah Diluluskan` : `Reserved Name Approved`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Sila pastikan nama yang ditempah yang diluluskan seperti dibawah:
      `
    }

    return `
      Please confirm the approved reserved name below:
    `
  }
}
