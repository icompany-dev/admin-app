import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeOfNameController extends SecretarialServiceController<
  CompanyAmendmentName,
  ReturnType<typeof useCompanyAmendmentNameStore>
> {
  application = ref<CompanyAmendmentName>(new CompanyAmendmentName())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_NAME, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAmendmentNameStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAmendmentName(response)
  }
}
