import { useLanguage } from "~/composables/useLanguage"
import { ColorModeUtil } from "~/scripts/utils/ColorMode"
import { useEventManagerStore } from "~/stores/EventManager"

export class ColorModeTogglerController {
  language = useLanguage()
  eventManager = useEventManagerStore()
  isDarkMode = ref<boolean>(false)

  constructor() {
    this.isDarkMode.value = ColorModeUtil.isDarkMode()
  }

  onColorModeChanged(): void {
    if (!this.eventManager.hasColorModeChanged) {
      return
    }

    this.isDarkMode.value = ColorModeUtil.isDarkMode()
    nextTick(() => {
      this.eventManager.setHasColorModeChanged(false)
    })
  }

  async onToggleClicked(): Promise<void> {
    this.isDarkMode.value = !this.isDarkMode.value
    ColorModeUtil.set(this.isDarkMode.value)
  }

  getModeColor(): string {
    if (!this.isDarkMode.value) {
      return this.language.isMalay() ? "Grafit" : "Graphite"
    }

    return this.language.isMalay() ? "Ungu" : "Purple"
  }

  getMobileClass(): string {
    return this.isDarkMode.value ? "text-purple-neon" : "text-graphite"
  }

  getMobileLabel(): string {
    return this.language.isEnglish() ? "Mode" : "Mod"
  }
}
