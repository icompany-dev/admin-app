import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class AssetPurchaseController extends SecretarialServiceController<
  CompanyAssetPurchase,
  ReturnType<typeof useCompanyAssetPurchaseStore>
> {
  application = ref<CompanyAssetPurchase>(new CompanyAssetPurchase())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_NAME, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAssetPurchaseStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAssetPurchase(response)
  }
}
