import { AskGemini } from "~/scripts/library/AskGemini"
import { AskSaira, type WorkflowInput } from "~/scripts/library/AskSaira"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"

export class AskSairaController {
  input: Ref<string> = ref<string>("")
  isLoading: Ref<boolean> = ref<boolean>(false)

  isShowAdditionalInputFields: Ref<boolean> = ref<boolean>(false)
  autoRun: boolean = false

  emitEvents: any | null = null

  askGemini = ref<AskGemini>(new AskGemini())

  language = useLanguage()
  eventManager = useEventManagerStore()

  constructor(input: string, emitEvents: any | null, autoRun: boolean = false) {
    this.emitEvents = emitEvents
    this.autoRun = autoRun
    this.setInput(input)
  }

  setInput(input: string): void {
    this.input.value = input
  }

  onClick(): void {
    if (this.autoRun) {
      this.run()
    } else {
      this.isShowAdditionalInputFields.value = !this.isShowAdditionalInputFields.value
    }
  }

  onCancelClicked(): void {
    this.isShowAdditionalInputFields.value = false
  }

  async run(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.input.value)) {
      let error: Error = new Error(Error.ERROR_TYPE_DATA, "")
      error.title = this.language.isMalay()
        ? "Sila cadangkan name untuk teruskan."
        : "Please propose a name to proceed."
      error.message = this.language.isMalay()
        ? "SAIRA akan gunakan nama untuk memberi nama alternatif."
        : "SAIRA will use the proposed name to suggest alternatives."
      error.handle()
      return
    }

    try {
      this.isLoading.value = true
      this.askGemini.value.resetValues()
      this.askGemini.value.setPrompt(this.input.value)
      this.eventManager.setIsDisablePage(true)
      await this.askGemini.value.run()
      this.checkAIStatus()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error("", "")
        error.setForAI()
        error.handle()
      }
      this.isLoading.value = false
    }
  }

  checkAIStatus(): void {
    if (this.askGemini.value.isProcessing) {
      setTimeout(() => {
        this.checkAIStatus()
      }, 100)
      return
    }

    this.isLoading.value = false
    this.askGemini.value.processResult()
    this.eventManager.setIsDisablePage(false)

    if (this.askGemini.value.outcome.length === 0) {
      let error: Error = new Error(Error.ERROR_TYPE_DATA, "")
      error.title = this.language.isMalay()
        ? "Saira tidak dapat memberi cadangan nama."
        : "Saira is unable to provide name suggestions."
      error.message = this.language.isMalay() ? "Sila cuba dengan nama lain." : "Please try with another name."
      error.handle()
      return
    }

    let result = JSON.parse(this.askGemini.value.outcome[0])
    this.emitEvents("workflowCompleted", result)
  }

  // Copywriting
  runButtonLabel(): string {
    return this.language.isMalay() ? "Tanya" : "Ask"
  }

  cancelButtonLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Cancel"
  }

  askSairaLabel(): string {
    if (this.isLoading.value) {
      return this.language.isMalay() ? "Sedang Tanya" : "Asking"
    }

    return this.language.isMalay() ? "Tanya" : "Ask"
  }
}
