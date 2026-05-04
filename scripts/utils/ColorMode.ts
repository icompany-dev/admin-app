import { User } from "~/scripts/models/User"
import { StringUtil } from "~/scripts/utils/String"
import { useEventManagerStore } from "~/stores/EventManager"
import { CurrentUser } from "./CurrentUser"

export class ColorModeUtil {
  static isDarkMode(): boolean {
    if (typeof document !== "undefined") {
      return document.body.getAttribute("data-theme") === "dark"
    }
    return false
  }

  static initializeTheme(user: User | null): void {
    let userSettings: any = user?.settings ?? null
    const isDarkMode = userSettings?.darkmode ?? false

    ColorModeUtil.setDocumentAttribute(isDarkMode)
  }

  static async set(isDarkMode: boolean): Promise<void> {
    if (ColorModeUtil.isDarkMode() === isDarkMode) {
      return
    }

    ColorModeUtil.setDocumentAttribute(isDarkMode)

    const eventManager = useEventManagerStore()
    eventManager.setHasColorModeChanged(true)

    let user = await CurrentUser.get()
    if (!user || StringUtil.isNullOrEmpty(user.id)) {
      return
    }

    if (user.settings) {
      user.settings = {
        ...user.settings,
        darkmode: isDarkMode,
      }
    } else {
      user.settings = {
        darkmode: isDarkMode,
      }
    }

    await user.update(useUserStore())
  }

  static setDocumentAttribute(isDarkMode: boolean): void {
    if (typeof document !== "undefined") {
      const theme = isDarkMode ? "dark" : "light"

      document.body.setAttribute("data-theme", theme)
    }
  }
}
