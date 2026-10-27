import { Company } from "../models/Company"
import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"
import { StringUtil } from "../utils/String"

export class PageSdnBhdController extends PageController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  previousCompanyId: Ref<string> = ref<string>("")
  previousCompanyName: Ref<string> = ref<string>("")
  nextCompanyId: Ref<string> = ref<string>("")
  nextCompanyName: Ref<string> = ref<string>("")

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

    let beforeAfterResponse = await repository.fetchBeforeAfter(this.companyId.value)
    this.previousCompanyId.value = beforeAfterResponse?.previous?.id ?? ""
    this.previousCompanyName.value = beforeAfterResponse?.previous?.name ?? ""
    this.nextCompanyId.value = beforeAfterResponse?.next?.id ?? ""
    this.nextCompanyName.value = beforeAfterResponse?.next?.name ?? ""

    if (!response || repository.error !== null) {
      this.company.value = new Company()
    } else {
      this.company.value = new Company(response)
    }

    super.setSeoMetadata(`${this.companyName} Details`, "Manage Sdn Bhd Details in One Place")
    this.pageAlias = `${this.companyName} Sdn Bhd Page`
  }

  onPreviousClicked(): void {
    if (StringUtil.isNullOrEmpty(this.previousCompanyId.value)) {
      this.onBackClicked()

      return
    }

    this.router.push(`/sdnbhds/${this.previousCompanyId.value}`)
  }

  onBackClicked(): void {
    this.router.push(`/sdnbhds/all`)
  }

  onNextClicked(): void {
    if (StringUtil.isNullOrEmpty(this.nextCompanyId.value)) {
      this.onBackClicked()

      return
    }

    this.router.push(`/sdnbhds/${this.nextCompanyId.value}`)
  }

  get companyName(): string {
    return StringUtil.capitalize(this.company.value.getFullName())
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

  get canPrevious(): boolean {
    return !StringUtil.isNullOrEmpty(this.previousCompanyId.value)
  }

  get canNext(): boolean {
    return !StringUtil.isNullOrEmpty(this.nextCompanyId.value)
  }
}
