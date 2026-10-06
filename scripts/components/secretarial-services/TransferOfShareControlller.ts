import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class TransferOfShareControlller extends SecretarialServiceController<
  CompanyShareholderTransfer,
  ReturnType<typeof useCompanyShareholderTransferStore>
> {
  application = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyShareholderTransferStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyShareholderTransfer(response)
  }
}
