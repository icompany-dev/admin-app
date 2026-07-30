import { BasePopupController } from "./BasePopupController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { CompletionOfIncorporation } from "~/scripts/types/emit-messages/CompletionOfIncorporation"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"

export class CompletionOfIncorporationController extends BasePopupController {
  companyName: Ref<string> = ref<string>("")

  dateValue: Ref<any> = ref<any>(null)
  incorporatedAt: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")

  constructor(companyName: string, emitEvents: any) {
    super(emitEvents)
    this.companyName.value = companyName
  }

  setCompanyName(companyName: string): void {
    this.companyName.value = companyName
  }

  override onProceedClicked(): void {
    this.incorporatedAt.value = this.dateValue.value
    if (!this.canProceed) {
      // add toast
      let error = new Error()
      error.setForIncompleteData()
      error.handle()
      return
    }

    this.emitEvents(
      EmitMessages.PROCEED,
      new CompletionOfIncorporation(
        this.incorporatedAt.value,
        this.registrationNumberNew.value,
        this.registrationNumberOld.value
      )
    )

    this.hide()
  }

  //getters
  get canProceed(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.incorporatedAt.value) &&
      !StringUtil.isNullOrEmpty(this.registrationNumberNew.value) &&
      !StringUtil.isNullOrEmpty(this.registrationNumberOld.value)
    )
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? "Pemerbadanan Sdn Bhd Baharu Lulus" : `Incorporation of New Sdn Bhd Approved!`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
      Sila sahkan bahawa pemerbadanan 
      <br><br>
      <span class='company-name'>${this.companyName.value} </span>
      <br><br>
      telah diluluskan dengan melengkapkan butiran dibawah.
      `
    }

    return `
      Please confirm that the incorporation of 
      <br><br>
      <span class='company-name'>${this.companyName.value} </span>
      <br><br>
      has been approved by completing the following details.
    `
  }

  get incorporatedAtLabel(): string {
    return this.language.isMalay() ? "Tarikh Diperbadankan" : "Date of Incorporation"
  }

  get registrationNumberNewLabel(): string {
    return this.language.isMalay() ? "No. Pendaftaran (Baharu)" : "Registration Number (New)"
  }

  get registrationNumberOldLabel(): string {
    return this.language.isMalay() ? "No. Pendaftaran (Baharu)" : "Registration Number (New)"
  }
}
