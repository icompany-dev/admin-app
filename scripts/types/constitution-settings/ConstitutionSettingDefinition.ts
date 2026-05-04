import { ConstitutionSettingPositionOfVariable } from "~/scripts/constants/ConstitutionSettings"

export class ConstitutionSettingDefinition {
  term: string = ""
  description: string = ""
  variable: string = ""
  positionOfVariable: string = ""

  constructor(
    term: string,
    description: string,
    variable: string = "",
    positionOfVariable: ConstitutionSettingPositionOfVariable = ConstitutionSettingPositionOfVariable.End
  ) {
    this.term = term
    this.description = description
    this.variable = variable
    this.positionOfVariable = positionOfVariable
  }
}
