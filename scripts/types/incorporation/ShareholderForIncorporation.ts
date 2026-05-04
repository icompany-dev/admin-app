import { ShareholdingType } from "~/scripts/constants/Shareholder"
import { File } from "~/scripts/models/File"

export class ShareholderForIncorporation {
  id: string = ""
  email: string = ""

  type: string = ShareholdingType.Individual
  totalOrdinaryShares: number = 0

  //if corporate rep
  companyName: string | null = null
  companyNameType: string | null = null

  isInputInFocused: boolean = false

  isEmailValid: boolean = true
  invalidMessage: string = ""

  isEmailRegistered: boolean = false

  isTotalOrdinarySharesValid: boolean = true
  ordinarySharesMessage: string = ""

  isCompanyNameValid: boolean = true
  companyNameMessage: string = ""

  supportingDocumentId: string | null = null
  supportingDocument: File = new File()

  constructor() {}

  resetChecks(): void {
    this.isEmailValid = true
    this.invalidMessage = ""
    this.isInputInFocused = false
  }

  resetCorporateRepresentativeValues(): void {
    this.companyName = null
    this.companyNameType = null
    this.isCompanyNameValid = true
    this.companyNameMessage = ""
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

  isCorporateRepresentative(): boolean {
    return this.type === ShareholdingType.Representative
  }
}
