import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { ApplicationController } from "../services/ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { CompanyConstants } from "~/scripts/constants/Company"

export class TransferOfShareApplicationController extends ApplicationController<CompanyShareholderTransfer> {
  resolutionsRef: any | null = null

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowShipped: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  isGenerating: Ref<boolean> = ref<boolean>(false)
  isApproving: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any) {
    super(
      props.companyId,
      useCompanyDirectorAppointmentStore(),
      CompanyShareholderTransfer,
      CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES,
      emitEvents,
      props.applicationId
    )

    this.minimumMajorityRequired.value = 0
    this.selectedApprovalType.value = "director"
  }
}
