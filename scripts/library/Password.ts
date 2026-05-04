export class Password {
  minPasswordCount: number = 8
  maxPasswordCount: number = 16
  specialChars: string = "!@#$%^&*"

  isLengthValid: boolean = false
  isContainUpper: boolean = false
  isContainLower: boolean = false
  isContainNumber: boolean = false
  isContainSpecialCharacter: boolean = false

  value: string

  constructor(password: string) {
    this.value = password
  }

  isPasswordValid(): boolean {

    return (
      this.isCountCorrect() &&
      this.hasUpperCase() &&
      this.hasLowerCase() &&
      this.hasNumber() &&
      this.hasSpecialChar()
    )
  }

  updateValidationStatus(): void {
    this.isLengthValid = this.isCountCorrect()
    this.isContainUpper = this.hasUpperCase()
    this.isContainLower = this.hasLowerCase()
    this.isContainNumber = this.hasNumber()
    this.isContainSpecialCharacter = this.hasSpecialChar()
  }

  isCountCorrect(): boolean {
    const len = this.value.length
    return len >= this.minPasswordCount &&
      len <= this.maxPasswordCount
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.value)
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.value)
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.value)
  }

  hasSpecialChar(): boolean {
    for (const char of this.value) {
      if (this.specialChars.includes(char)) {
        return true
      }
    }

    return false
  }

  getRuleList(): string[] {
    const rules = [
      "1 uppercase letter (A–Z)",
      "1 lowercase letter (a–z)",
      "1 number (0–9)",
      `1 special character (e.g. ${this.specialChars})`,
    ]

    return rules
  }
}
