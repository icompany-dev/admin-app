import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class SwitchOutController extends SecretarialServiceController<
  CompanySwitchOut,
  ReturnType<typeof useCompanySwitchOutStore>
> {
  application = ref<CompanySwitchOut>(new CompanySwitchOut())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SWITCH_OUT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanySwitchOutStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanySwitchOut(response)
  }
}
