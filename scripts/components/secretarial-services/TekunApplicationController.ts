import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyTekunApplication } from "~/scripts/models/CompanyTekunApplication"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class TekunApplicationController extends SecretarialServiceController<
  CompanyTekunApplication,
  ReturnType<typeof useCompanyLoanApplicationStore>
> {
  application = ref<CompanyTekunApplication>(new CompanyTekunApplication())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_NAME, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyLoanApplicationStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyTekunApplication(response)
  }

  async onConvertToForms(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.onMoveToForms()
  }
}
