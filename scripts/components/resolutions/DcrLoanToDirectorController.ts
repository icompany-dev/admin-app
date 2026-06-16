import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ResolutionLoanToDirectorController } from "./ResolutionLoanToDirectorController"
import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"

export class DcrLoanToDirectorController extends ResolutionLoanToDirectorController {
  constructor(props: IPropsResolutionDocument<CompanyDirectorLoan>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      props.isInPreviewMode,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }
}
