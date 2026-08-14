import { AlloteeType } from "../constants/AllotmentOfShares"
import { ShareholdingType } from "../constants/Shareholder"
import { CompanyShareAllotTo } from "../models/CompanyShareholderAllotment"

export class AllotTo {
  type: string = AlloteeType.Existing // can be new
  allotee: CompanyShareAllotTo = new CompanyShareAllotTo()
  isDisabled: boolean = false

  shareholdingType: string = ShareholdingType.Individual
  email: string = ""
  companyName: string = ""
  companyType: string = "sdnbhd"
  companyRegistrationNumberOld: string = ""
  companyRegistrationNumberNew: string = ""

  constructor(type: string, allotee: CompanyShareAllotTo, isDisabled: boolean) {
    this.type = type
    this.allotee.clone(allotee)
    this.isDisabled = isDisabled
  }

  name(): string {
    if (this.allotee.shareholder) {
      return this.allotee.shareholder.type === ShareholdingType.Representative
        ? (this.allotee.shareholder.company?.getFullName() ?? "")
        : (this.allotee.shareholder.user?.name ?? this.allotee.shareholder.name)
    }

    if (this.allotee.shareholderInvitation) {
      return this.allotee.shareholderInvitation.company
        ? (this.allotee.shareholderInvitation.company.name ?? this.allotee.shareholderName)
        : (this.allotee.shareholderInvitation.name ?? this.allotee.shareholderName)
    }

    return this.allotee.shareholderName
  }

  alternateType(): string {
    return this.type === AlloteeType.New ? AlloteeType.Existing : AlloteeType.New
  }
}
