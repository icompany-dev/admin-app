import { SdnBhdServiceButton } from "~/scripts/types/SdnBhdServiceButton"
import { useLocalTime } from "#imports"
import { useLanguage } from "#imports"
import { StringUtil } from "~/scripts/utils/String"

export class ServiceOptionButtonsController {
  optionButtons = ref<SdnBhdServiceButton[]>([])
  hasPreviousApplication = ref<boolean>(false)
  lastApplicationDate = ref<string>("")

  time = useLocalTime()
  language = useLanguage()

  currentActiveIndex = ref<number>(0)
  currentHoveredIndex = ref<number | null>(null)

  constructor(hasPreviousApplication: boolean, lastApplicationDate: string | null) {
    this.setHasPreviousApplication(hasPreviousApplication)
    if (!StringUtil.isNullOrEmpty(lastApplicationDate)) {
      this.setLastApplicationDate(lastApplicationDate ?? "")
    }
  }

  clearOptionButtons(): void {
    this.optionButtons.value = []
  }

  addOptionButton(name: string, label: string, cta: () => {}, hoverLabel: string = ""): void {
    this.optionButtons.value.push(new SdnBhdServiceButton(name, label, cta, hoverLabel))
  }

  onButtonClicked(index: number): void {
    this.currentActiveIndex.value = index
  }

  isButtonActive(index: number): boolean {
    return this.currentActiveIndex.value === index
  }

  onMouseEnter(index: number): void {
    this.currentHoveredIndex.value = index
  }

  onMouseLeave(): void {
    this.currentHoveredIndex.value = null
  }

  isButtonHovered(index: number): boolean {
    return this.currentHoveredIndex.value === index
  }

  setHasPreviousApplication(hasPreviousApplication: boolean): void {
    this.hasPreviousApplication.value = hasPreviousApplication
  }

  setLastApplicationDate(lastApplicationDate: string): void {
    if (StringUtil.isNullOrEmpty(lastApplicationDate)) {
      this.lastApplicationDate.value = ""
      return
    }

    this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplicationDate)
  }

  getCurrentActiveButton(): SdnBhdServiceButton {
    return this.optionButtons.value[this.currentActiveIndex.value]
  }

  lastApplicationCopywriting(): string {
    if (this.hasPreviousApplication.value) {
      return this.language.isMalay()
        ? `Permohonan terakhir anda adalah ${this.lastApplicationDate.value}`
        : `Your last application was ${this.lastApplicationDate.value}`
    }

    return this.language.isMalay()
      ? "Tiada rekod permohonan terdahulu besama kami."
      : "There is no record of your prior application with us."
  }
}
