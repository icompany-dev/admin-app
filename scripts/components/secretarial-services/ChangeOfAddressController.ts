import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeOfAddressController extends SecretarialServiceController<
  CompanyAmendmentAddress,
  ReturnType<typeof useCompanyAmendmentAddressStore>
> {
  application = ref<CompanyAmendmentAddress>(new CompanyAmendmentAddress())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_ADDRESS, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAmendmentAddressStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAmendmentAddress(response)
  }

  async onConvertToForms(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.onMoveToForms()
  }
}
