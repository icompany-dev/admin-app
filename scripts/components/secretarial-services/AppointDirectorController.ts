import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class AppointDirectorController extends SecretarialServiceController<
  CompanyDirectorAppointment,
  ReturnType<typeof useCompanyDirectorAppointmentStore>
> {
  application = ref<CompanyDirectorAppointment>(new CompanyDirectorAppointment())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_DIRECTOR_APPOINTMENT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDirectorAppointmentStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyDirectorAppointment(response)
  }
}
