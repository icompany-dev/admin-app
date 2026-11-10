import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ResignationOfDirectorController extends SecretarialServiceController<
  CompanyDirectorResignation,
  ReturnType<typeof useCompanyDirectorResignationStore>
> {
  application = ref<CompanyDirectorResignation>(new CompanyDirectorResignation())

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_DIRECTOR_APPOINTMENT, emitEvents)
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDirectorResignationStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyDirectorResignation(response)
  }
}
