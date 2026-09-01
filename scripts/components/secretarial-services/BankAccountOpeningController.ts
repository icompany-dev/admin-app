import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class BankAccountOpeningController extends SecretarialServiceController<
  CompanyBankAccountOpening,
  ReturnType<typeof useCompanyBankAccountOpeningStore>
> {
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_OPEN_BANK_ACCOUNT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyBankAccountOpeningStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyBankAccountOpening(response)
  }
}
