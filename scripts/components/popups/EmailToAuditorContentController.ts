import type { PropsEmailToAuditorContent } from "~/scripts/props/PropsEmailToAuditorContent"
import { BasePopupController } from "./BasePopupController"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"

export class EmailToAuditorContentController extends BasePopupController {
  companyName: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")
  auditorFirmName: Ref<string> = ref<string>("")
  auditorEmail: Ref<string> = ref<string>("")

  constructor(props: PropsEmailToAuditorContent, emitEvents: any | null) {
    super(emitEvents)
  }

  setDataProps(props: PropsEmailToAuditorContent): void {}

  onProceedClicked(): void {
    // this is just a placeholder
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Pengarah` : `Add Shareholder`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan butiran yang diperlukar untuk tambah Pengarah.
      `
    }

    return `
      Complete the required details below to add new Shareholder.
    `
  }
}
