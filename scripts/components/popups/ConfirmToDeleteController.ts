import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { remove } from "lodash"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class ConfirmToDeleteController extends BasePopupController {
  removeItemName: Ref<string> = ref<string>("")

  constructor(removeItemName: string, emitEvents: any) {
    super(emitEvents)

    this.setRemoveItemName(removeItemName)
  }

  setRemoveItemName(removeItemName: string): void {
    this.removeItemName.value = removeItemName
  }

  onProceedClicked(): void {
    this.emitEvents(EmitMessages.PROCEED)
    this.hide()
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Memadam ${this.removeItemName.value}` : `Removing ${this.removeItemName.value}`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Anda ingin memadam ${this.removeItemName.value} ini. Tindakan ini tidak boleh ditarik balik.
        <br><br>
        Klik '<b>Teruskan</b>' jika anda pasti.
      `
    }

    return `
      You are about to remove this ${this.removeItemName.value}. This action cannot be undone.
      <br><br>
      Click '<b>Proceed</b>' if you are sure.
    `
  }
}
