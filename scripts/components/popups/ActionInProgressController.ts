import type { PropsActionInProgress } from "~/scripts/props/PropsActionInProgress"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class ActionInProgressController extends BasePopupController {
  totalActionsToTake: Ref<number> = ref<number>(0)
  currentActionAt: Ref<number> = ref<number>(0)
  actionName: Ref<string> = ref<string>("action")

  constructor(props: PropsActionInProgress, emitEvents: any) {
    super(emitEvents)

    this.setDataProps(props)
  }

  setDataProps(props: PropsActionInProgress): void {
    this.totalActionsToTake.value = props.totalActionsToTake
    this.currentActionAt.value = props.currentActionAt
    this.actionName.value = props.actionName
  }

  onProceedClicked(): void {
    this.emitEvents(EmitMessages.PROCEED)
    this.hide()
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Aksi dalam Progres` : `Action in Progress`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
       Sila jangan muat semula muka ini. Kami sedang ${this.actionName.value}.
      `
    }

    return `
      Please do not refresh this page. We are ${this.actionName.value}.
    `
  }

  get percentageCompleted(): string {
    let percentage = Math.ceil((this.currentActionAt.value / this.totalActionsToTake.value) * 100)

    return percentage.toString()
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? `${this.percentageCompleted}% Lengkap` : `${this.percentageCompleted}% Completed`
  }

  get loaderSublabel(): string {
    return this.language.isMalay()
      ? `Memproses ${this.currentActionAt.value} of ${this.totalActionsToTake.value}`
      : `Processing ${this.currentActionAt.value} of ${this.totalActionsToTake.value}`
  }
}
