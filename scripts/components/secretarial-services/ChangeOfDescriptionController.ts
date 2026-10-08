import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeOfDescriptionController extends SecretarialServiceController<
  CompanyAmendmentDescription,
  ReturnType<typeof useCompanyAmendmentDescriptionStore>
> {
  application = ref<CompanyAmendmentDescription>(new CompanyAmendmentDescription())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AMENDMENT_DESCRIPTION, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAmendmentDescriptionStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAmendmentDescription(response)
  }

  async onConvertToForms(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    await this.documentRef.onMoveToForms()
  }
}
