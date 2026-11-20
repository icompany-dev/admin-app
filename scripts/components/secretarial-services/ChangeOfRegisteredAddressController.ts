import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeOfRegisteredAddressController extends SecretarialServiceController<
  CompanyAmendmentRegisteredAddress,
  ReturnType<typeof useCompanyAmendmentRegisteredAddressStore>
> {
  application = ref<CompanyAmendmentRegisteredAddress>(new CompanyAmendmentRegisteredAddress())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_ADDRESS, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAmendmentRegisteredAddressStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAmendmentRegisteredAddress(response)
  }

  async onConvertToForms(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.onMoveToForms()
  }
}
