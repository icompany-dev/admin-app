import { SelectOption } from "../types/SelectOption"

export enum DirectorResignationType {
  Immediate = "immediate",
  FourteenDays = "fourteen-days",
}

export enum DirectorResignationTypeDescription {
  Immediate = "immediately upon delivery",
  FourteenDays = "fourteen (14) Business Days from the Date",
}

export class DirectorResignationConstants {
  static TYPE_IMMEDIATE: SelectOption = new SelectOption(
    DirectorResignationType.Immediate,
    DirectorResignationType.Immediate,
    `${DirectorResignationTypeDescription.Immediate} of this Notice; or`
  )

  static TYPE_FOURTEEN_DAYS: SelectOption = new SelectOption(
    DirectorResignationType.FourteenDays,
    DirectorResignationType.FourteenDays,
    `${DirectorResignationTypeDescription.FourteenDays} of this Notice.`
  )
}
