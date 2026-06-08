import { useNuxtApp } from "#app"
export class Error {
  static ERROR_TYPE_API = "api"
  static ERROR_TYPE_DATA = "data"
  static ERROR_TYPE_CODE = "code"

  type: string = ""
  message: string = ""
  title: string = ""
  icon: string = "error"
  nuxtApp = useNuxtApp()
  // i18n = useI18n()
  isMalay: boolean = false

  constructor() {}

  handle() {
    if (this.type === Error.ERROR_TYPE_API) {
      this.promptError()
    }
    if (this.type === Error.ERROR_TYPE_DATA) {
      this.promptWarning()
    }
    if (this.type === Error.ERROR_TYPE_CODE) {
      this.promptError()
    }
  }

  promptError() {
    if (this.title === "") {
      this.title = "Error Encountered"
    }

    this.nuxtApp.$iziToast.error({
      title: this.title,
      message: this.message,
      icon: this.icon,
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  promptWarning() {
    if (this.title === "") {
      this.title = "Warning"
    }

    this.nuxtApp.$iziToast.warning({
      title: this.title,
      message: this.message,
      icon: "warning",
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  setForFetchAll(): void {
    this.title = this.isMalay ? `Tiada Maklumat Dijumpai` : `No Information Found`
    this.message = this.isMalay
      ? "Sila muat semula muka ini dan cuba sekali lagi. Jika isu ini berulang, sila log masuk semula."
      : "Please refresh the page and try again. If the issue persists, please re-login."

    this.type = Error.ERROR_TYPE_API
  }

  setForFetch(): void {
    this.title = this.isMalay ? `Tiada Maklumat Dijumpai` : `No Information Found`
    this.message = this.isMalay
      ? "Sila muat semula muka ini dan cuba sekali lagi. Jika isu ini berulang, sila log masuk semula."
      : "Please refresh the page and try again. If the issue persists, please re-login."

    this.type = Error.ERROR_TYPE_API
  }
}
