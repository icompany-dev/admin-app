import { Company } from "../models/Company"
import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"

export class PageSdnBhdController extends PageController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  router = useRouter()
  route = useRoute()

  constructor() {
    super("Sdn Bhd Details", "Manage Sdn Bhd Details in One Place", "Sdn Bhd Page")

    this.handleRoute()
  }

  async handleRoute(): Promise<void> {
    let paramId = this.route.params?.id ?? null
    if (!paramId || (Array.isArray(paramId) && paramId.length <= 0) || (!Array.isArray(paramId) && paramId === "")) {
      this.router.back()
      return
    }

    if (Array.isArray(paramId)) {
      this.companyId.value = paramId[0]
    } else {
      this.companyId.value = paramId
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)

    if (!response || repository.error === null) {
      this.company.value = new Company()
    } else {
      this.company.value = new Company(response)
    }

    super.setSeoMetadata(`${this.companyName} Details`, "Manage Sdn Bhd Details in One Place")
    this.pageAlias = `${this.companyName} Sdn Bhd Page`
  }

  onBackClicked(): void {
    this.router.push(`/sdnbhds`)
  }

  get companyName(): string {
    return this.company.value.getFullName()
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("Companies", ""),
      new PropsBreadCrumbItem("All Sdn Bhd", "/sdnbhds"),
      new PropsBreadCrumbItem(this.companyName, ""),
    ])
  }

  get sortOrderLabel(): string {
    return "By Z/A"
  }

  get propsDataOrders(): PropsDataOrders[] {
    return [new PropsDataOrders(this.sortOrderLabel, "asc"), new PropsDataOrders("Show Demo", "false")]
  }

  get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      false,
      "",
      false,
      this.propsDataOrders,
      false,
      new PropsDataDateFilter("", "", ""),
      true
    )
  }
}
