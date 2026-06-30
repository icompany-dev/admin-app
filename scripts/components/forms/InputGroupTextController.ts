import { StringUtil } from "~/scripts/utils/String"

export class InputGroupTextController {
  inputValue: Ref<string> = ref<string>("")
  isFocused: Ref<boolean> = ref<boolean>(false)
  isInputValid: Ref<boolean> = ref<boolean>(true)
  isWarningRequired: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  constructor(inputValue: string, emitEvents: any) {
    this.emitEvents = emitEvents
    this.inputValue.value = inputValue
  }

  setInputValue(inputValue: string): void {
    if (this.inputValue.value === inputValue) {
      // skip if there is no need to update to prevent unnecessary reactivity
      return
    }
    this.inputValue.value = inputValue
  }

  setIsInputValid(isInputValid: boolean): void {
    this.isInputValid.value = isInputValid
  }

  setIsWarningRequired(isWarningRequired: boolean): void {
    this.isWarningRequired.value = isWarningRequired
  }

  onFocus(): void {
    this.isFocused.value = true
  }

  onBlur(): void {
    this.isFocused.value = false
    this.emitEvents("updated", this.inputValue.value)
  }

  onEnter(): void {
    this.emitEvents("updated", this.inputValue.value)
  }

  inputGroupClass(): string {
    let classes: string[] = []

    if (this.isFocused.value) {
      classes.push("focused")
    }

    if (!StringUtil.isNullOrEmpty(this.inputValue.value)) {
      if (this.isWarningRequired.value) {
        classes.push("warning")
      } else if (!this.isInputValid.value) {
        classes.push("danger")
      } else {
        classes.push("success")
      }
    }

    return classes.join(" ")
  }
}
