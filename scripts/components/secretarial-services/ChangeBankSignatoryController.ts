import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeBankSignatoryController extends SecretarialServiceController<
  CompanyChangeBankSignatory,
  ReturnType<typeof useCompanyChangeBankSignatoryStore>
> {
  application = ref<CompanyChangeBankSignatory>(new CompanyChangeBankSignatory())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_CHANGE_BANK_SIGNATORY, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyChangeBankSignatoryStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyChangeBankSignatory(response)
  }
}
