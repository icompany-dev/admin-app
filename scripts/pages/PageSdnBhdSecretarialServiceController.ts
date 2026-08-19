import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ServiceName, ServiceNames } from "../constants/ServiceNames"
import { StringUtil } from "../utils/String"
import { PropsSecretarialServices } from "../props/PropsSecretarialServices"
import { PageSdnBhdSecretarialServicesController } from "./PageSdnBhdSecretarialServicesController"
import { PropsSecretarialService } from "../props/PropsSecretarialService"

export class PageSdnBhdSecretarialServiceController extends PageSdnBhdSecretarialServicesController {
  override onClearSelected(): void {
    let router = useRouter()
    router.push({
      path: `/services/${this.route.params.service_name}`,
    })
  }

  override get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      false,
      this.searchText.value,
      false,
      [],
      false,
      new PropsDataDateFilter("", "", ""),
      true
    )
  }

  get applicationId(): string {
    return Array.isArray(this.route.params) ? this.route.params[0].id : this.route.params.id
  }

  get secretarialServiceProps(): PropsSecretarialService {
    return new PropsSecretarialService("", this.applicationId, "", this.targetName.value)
  }
}
