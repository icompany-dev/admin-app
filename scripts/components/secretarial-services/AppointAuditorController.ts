import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class AppointAuditorController extends SecretarialServiceController<
  CompanyAuditorAppointment,
  ReturnType<typeof useCompanyAuditorAppointmentStore>
> {
  application = ref<CompanyAuditorAppointment>(new CompanyAuditorAppointment())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_AUDITOR_APPOINTMENT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAuditorAppointmentStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAuditorAppointment(response)
  }
}
