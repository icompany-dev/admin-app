import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class PaymentToDirectorController extends SecretarialServiceController<
  CompanyDirectorPayment,
  ReturnType<typeof useCompanyDirectorPaymentStore>
> {
  application = ref<CompanyDirectorPayment>(new CompanyDirectorPayment())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_DIRECTOR_APPOINTMENT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDirectorPaymentStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyDirectorPayment(response)
  }
}
