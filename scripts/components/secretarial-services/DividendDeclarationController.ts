import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class DividendDeclarationController extends SecretarialServiceController<
  CompanyDividendDeclaration,
  ReturnType<typeof useCompanyDividendDeclarationStore>
> {
  application = ref<CompanyDividendDeclaration>(new CompanyDividendDeclaration())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_NAME, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDividendDeclarationStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyDividendDeclaration(response)
  }
}
