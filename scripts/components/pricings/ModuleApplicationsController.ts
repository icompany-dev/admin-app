import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsPricing } from "~/scripts/props/PropsPricing"
import type { PropsPricingsModuleApplications } from "~/scripts/props/PropsPricingsModuleApplications"
import { StringUtil } from "~/scripts/utils/String"

export class ModuleApplicationsController {
  emitEvents: any | null = null

  applications: Ref<LabelItem[]> = ref<LabelItem[]>([])
  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowing: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  confirmToDeleteRef: any | null = null
  labelItemToRemove: Ref<LabelItem> = ref<LabelItem>(new LabelItem())

  constructor(props: PropsPricingsModuleApplications, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setApplications(props.applications)
    this.setIsShowing(props.isShowing)
  }

  setApplications(applications: LabelItem[]): void {
    this.applications.value = applications.map((d: LabelItem) => {
      return new LabelItem(d)
    })

    this.fetchServicePricings()
  }

  setIsShowing(isShowing: boolean): void {
    this.isShowing.value = isShowing
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
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
    return new PropsPricing(servicePricing, false)
  }

  onRemoveApplicationClicked(servicePricing: ServicePricing): void {
    let labelItem = this.applications.value.find((li: LabelItem) => {
      return li.targetId === servicePricing.id
    })
    if (!labelItem) {
      return
    }

    this.labelItemToRemove.value = new LabelItem(labelItem)

    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedRemoved(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.labelItemToRemove.value.id)) {
      return
    }

    try {
      this.emitEvents("remove", this.labelItemToRemove.value)

      await this.labelItemToRemove.value.deleteItem(useLabelStore())

      let toastTitle = this.language.isMalay()
        ? "Aplikasi telah dikeluarkan dari modul."
        : "The Application is removed from the module."
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      //
    }
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Populating the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Aplikasi" : "Applications"
  }

  get itemRemoveName(): string {
    return this.language.isMalay() ? "Aplikasi" : "Application"
  }
}
