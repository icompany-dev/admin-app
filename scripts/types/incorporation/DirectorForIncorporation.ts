export class DirectorForIncorporation {
  id: string = ""
  email: string = ""

  isInputInFocused: boolean = false

  isEmailValid: boolean = true
  invalidMessage: string = ""

  isEmailRegistered: boolean = false

  constructor() {}

  resetChecks() {
    this.isEmailValid = true
    this.invalidMessage = ""
    this.isInputInFocused = false
  }

  inputGroupClass(): string {
    let classes: string[] = []

    if (this.isInputInFocused) {
      classes.push("focused")
    }

    if (this.email.length > 0) {
      if (!this.isEmailValid) {
        classes.push("danger")
      } else {
        classes.push("success")
      }
    }

    return classes.join(" ")
  }
}
