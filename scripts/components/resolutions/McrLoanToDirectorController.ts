import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ResolutionLoanToDirectorController } from "./ResolutionLoanToDirectorController"
import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"

export class McrLoanToDirectorController extends ResolutionLoanToDirectorController {
  constructor(props: IPropsResolutionDocument<CompanyDirectorLoan>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      props.isInPreviewMode,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }
}
