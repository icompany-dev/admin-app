import { Toast } from "~/scripts/library/Toast"

export class CopyValueController {
  valueToCopy: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  language = useLanguage()

  isCopied: Ref<boolean> = ref<boolean>(false)

  constructor(valueToCopy: string, emitEvents: any) {
    this.valueToCopy.value = valueToCopy
    this.emitEvents = emitEvents
  }

  setValueToCopy(valueToCopy: string): void {
    this.valueToCopy.value = valueToCopy
  }

  onClick(): void {
    if (this.isCopied.value) {
      return
    }

    try {
      this.isCopied.value = true
      navigator.clipboard.writeText(this.valueToCopy.value)

      let toastTitle = this.language.isMalay()
        ? `${this.valueToCopy.value} telah disalin!`
        : `"${this.valueToCopy.value}" has been copied!`
      let toastMessage = this.language.isMalay()
        ? `Hanya tampalkan dimana anda perlu.`
        : `Just paste it anywhere you need to.`
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      this.isCopied.value = false
    } finally {
      setTimeout(() => {
        this.isCopied.value = false
      }, 500)
    }
  }
}
