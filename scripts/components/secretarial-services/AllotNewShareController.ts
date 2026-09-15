import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class AllotNewShareController extends SecretarialServiceController<
  CompanyShareholderAllotment,
  ReturnType<typeof useCompanyShareholderAllotmentStore>
> {
  application = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyShareholderAllotmentStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyShareholderAllotment(response)
  }
}
