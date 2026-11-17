import { Error } from "~/scripts/library/Error"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsPricing } from "~/scripts/props/PropsPricing"
import type { PropsPricingsModuleApplications } from "~/scripts/props/PropsPricingsModuleApplications"

export class ModuleApplicationsController {
  emitEvents: any | null = null

  applications: Ref<LabelItem[]> = ref<LabelItem[]>([])
  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowing: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  constructor(props: PropsPricingsModuleApplications, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setApplications(props.applications)
    this.setIsShowing(props.isShowing)
  }

  setApplications(applications: LabelItem[]): void {
    this.applications.value = applications.map((d: LabelItem) => {
      return new LabelItem(d)
    })

    console.log("in props", this.applications.value)

    this.fetchServicePricings()
  }

  setIsShowing(isShowing: boolean): void {
    this.isShowing.value = isShowing
  }

  async fetchServicePricings(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.isLoading.value = true
    this.servicePricings.value = []

    try {
      let repository = useServicePricingStore()
      let promises = this.applications.value.map((li: LabelItem) => {
        return repository.fetch(li.targetId).then((r) => {
          this.servicePricings.value.push(new ServicePricing(r))
        })
      })

      await Promise.all(promises)
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  getPropsPricing(servicePricing: ServicePricing): PropsPricing {
    return new PropsPricing(servicePricing, true)
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Populating the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Aplikasi" : "Applications"
  }
}
