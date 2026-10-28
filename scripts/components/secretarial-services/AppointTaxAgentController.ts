import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class AppointTaxAgentController extends SecretarialServiceController<
  CompanyAppointmentOfTaxAgent,
  ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>
> {
  application = ref<CompanyAppointmentOfTaxAgent>(new CompanyAppointmentOfTaxAgent())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_TAX_AGENT_APPOINTMENT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAppointmentOfTaxAgentStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAppointmentOfTaxAgent(response)
  }
}
