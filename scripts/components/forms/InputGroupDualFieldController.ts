import { StringUtil } from "~/scripts/utils/String"

export class InputGroupDualFieldController {
  firstInputValue: Ref<string> = ref<string>("")
  secondInputValue: Ref<string> = ref<string>("")
  isFocused: Ref<boolean> = ref<boolean>(false)
  isInputValid: Ref<boolean> = ref<boolean>(true)
  isWarningRequired: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  constructor(firstInputValue: string, secondInputValue: string, emitEvents: any) {
    this.firstInputValue.value = firstInputValue
    this.secondInputValue.value = secondInputValue
    this.emitEvents = emitEvents
  }

  setFirstInputValue(firstInputValue: string): void {
    if (this.firstInputValue.value === firstInputValue) {
      // skip if there is no need to update to prevent unnecessary reactivity
      return
    }
    this.firstInputValue.value = firstInputValue
  }

  setSecondInputValue(secondInputValue: string): void {
    if (this.secondInputValue.value === secondInputValue) {
      // skip if there is no need to update to prevent unnecessary reactivity
      return
    }
    this.secondInputValue.value = secondInputValue
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

  onFirstBlur(): void {
    this.emitEvents("updatedFirst", this.firstInputValue.value)
    this.isFocused.value = false
  }

  onSecondBlur(): void {
    this.emitEvents("updatedSecond", this.secondInputValue.value)
    this.isFocused.value = false
  }

  inputGroupClass(): string {
    let classes: string[] = []

    if (this.isFocused.value) {
      classes.push("focused")
    }

    if (!StringUtil.isNullOrEmpty(this.firstInputValue.value)) {
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
