import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { Label } from "~/scripts/models/Label"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsGroupedServicePricing } from "~/scripts/props/PropsGroupedServicePricing"
import { PropsPricingsModuleApplications } from "~/scripts/props/PropsPricingsModuleApplications"
import { PropsServicePricingEditor } from "~/scripts/props/PropsServicePricingEditor"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  modules: Ref<Label[]> = ref<Label[]>([])
  moduleApplications: Ref<LabelItem[]> = ref<LabelItem[]>([])

  emitEvents: any | null = null

  editorRef: any | null = null
  confirmToDeleteRef: any | null = null
  groupedThemeRef: any | null = null
  servicesRef: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  servicePricingForEditor: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  moduleToRemove: Ref<Label> = ref<Label>(new Label())

  moduleInView: Ref<Label> = ref<Label>(new Label())

  isAddingNewModule: Ref<boolean> = ref<boolean>(false)
  isSubmittingNewModule: Ref<boolean> = ref<boolean>(false)
  newModule: Ref<Label> = ref<Label>(new Label())

  isAddingService: Ref<boolean> = ref<boolean>(false)

  constructor(emitEvents: any | null) {
    this.emitEvents = emitEvents

    this.init()
  }

  setEditorRef(editorRef: any): void {
    this.editorRef = editorRef
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  setGroupedThemeRef(groupedThemeRef: any): void {
    this.groupedThemeRef = groupedThemeRef
  }

  setServicesRef(servicesRef: any): void {
    this.servicesRef = servicesRef
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.isLoading.value = true

    try {
      let repository = useLabelStore()
      let response = await repository.fetchForServicePricings()

      if (!response.data || !response.data.labels || !response.data.label_items) {
        this.modules.value = []
        this.moduleApplications.value = []
        return
      }

      this.modules.value = response.data.labels.map((d: any) => {
        return new Label(d)
      })

      this.moduleApplications.value = response.data.label_items.map((d: any) => {
        return new LabelItem(d)
      })

      console.log(this.moduleApplications.value)
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

  getApplicationsForModules(module: Label): LabelItem[] {
    let applications = this.moduleApplications.value.filter((d: LabelItem) => {
      return d.labelId === module.id
    })

    return applications
  }

  getNumberOfApplicationsInModule(module: Label): number {
    return this.getApplicationsForModules(module).length
  }

  getApplicationsLabel(module: Label): string {
    if (this.language.isMalay()) {
      return `Aplikasi`
    }

    return this.getApplicationsForModules(module).length > 1 ? "Applications" : "Application"
  }

  addNewPricing(): void {
    this.isAddingService.value = true
    this.servicePricingForEditor.value = new ServicePricing()

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  onAddNewApplication(): void {
    this.isAddingService.value = false
    this.servicePricingForEditor.value = new ServicePricing()

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  onRemoveModule(module: Label): void {
    this.moduleToRemove.value = new Label(module)

    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedRemove(): Promise<void> {
    this.modules.value = this.modules.value.filter((m: Label) => {
      return m.id !== this.moduleToRemove.value.id
    })

    try {
      if (!StringUtil.isNullOrEmpty(this.moduleToRemove.value.id)) {
        await this.moduleToRemove.value.remove(useLabelStore())
      }

      let toastTitle = this.language.isMalay() ? "Modul telah dipadamkan." : "The Module is Removed."
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.moduleToRemove.value = new Label()
    }
  }

  onViewApplications(module: Label): void {
    if (this.isViewingApplications(module)) {
      this.moduleInView.value = new Label()
    } else {
      this.moduleInView.value = new Label(module)
    }
  }

  isViewingApplications(module: Label): boolean {
    return this.moduleInView.value.id === module.id
  }

  onCancelModuleClicked(): void {
    //
  }

  onModuleUpdated(newData: Label): void {
    this.modules.value.forEach((d: Label) => {
      if (d.id === newData.id) {
        d.name = newData.name
      }
    })

    if (this.moduleInView.value.id === newData.id) {
      this.moduleInView.value.name = newData.name
    }
  }

  onAddNewModuleClicked(): void {
    this.moduleInView.value = new Label()
    this.newModule.value = new Label()
    this.isAddingNewModule.value = true
  }

  onCancelAddNewModule(): void {
    this.newModule.value = new Label()
    this.isAddingNewModule.value = false
  }

  async onProceedAddNewModule(): Promise<void> {
    if (this.isSubmittingNewModule.value) {
      return
    }

    this.isSubmittingNewModule.value = true
    try {
      await this.newModule.value.create(useLabelStore())

      this.modules.value.push(new Label(this.newModule.value))

      let toastTitle = this.language.isMalay() ? "Modul Baharu telah ditambah." : "The New Module is added."
      let toastMessage = this.language.isMalay()
        ? "Anda boleh tambah aplikasi ke dalam Modul baharu."
        : "You can add Applicstions to the Module."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      this.isAddingNewModule.value = false
      this.newModule.value = new Label()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSubmittingNewModule.value = false
    }
  }

  getPricingsModuleApplicationsProps(module: Label): PropsPricingsModuleApplications {
    return new PropsPricingsModuleApplications(
      this.getApplicationsForModules(module),
      this.isViewingApplications(module)
    )
  }

  onAddApplicationsClicked(): void {
    if (this.groupedThemeRef) {
      this.groupedThemeRef.show()
    }
  }

  onEditApplicationClicked(servicePricing: ServicePricing): void {
    this.servicePricingForEditor.value = new ServicePricing(servicePricing)
    this.isAddingService.value = false

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  onApplicationsUpdated(labelItems: LabelItem[]): void {
    this.moduleApplications.value = this.moduleApplications.value.concat(labelItems)
  }

  onApplicationRemoved(labelItemId: string): void {
    this.moduleApplications.value = this.moduleApplications.value.filter((application: LabelItem) => {
      return application.id !== labelItemId
    })
  }

  showServices(): void {
    if (this.servicesRef) {
      this.servicesRef.show()
    }
  }

  onEditServices(servicePricing: ServicePricing): void {
    this.servicePricingForEditor.value = new ServicePricing(servicePricing)
    this.isAddingService.value = true

    if (this.editorRef) {
      this.editorRef.show()
    }
  }

  async onServicePricingUpdated(servicePricing: ServicePricing): Promise<void> {
    if (this.isAddingService.value) {
      if (this.servicesRef) {
        this.servicesRef.handlePostCreateUpdate(servicePricing)
      }
    } else {
      // Add to the module!
      let newLabelItem = new LabelItem()
      newLabelItem.label = new Label(this.moduleInView.value)
      newLabelItem.labelId = this.moduleInView.value.id
      newLabelItem.targetType = "service_pricing"
      newLabelItem.targetId = servicePricing.id

      await newLabelItem.addItem(useLabelStore())
      this.moduleApplications.value.push(newLabelItem)
    }
  }

  onApplicationRemovedFromModule(labelItem: LabelItem): void {
    this.moduleApplications.value = this.moduleApplications.value.filter((li: LabelItem) => {
      return li.id !== labelItem.id
    })
  }

  //getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Modul" : "Modules"
  }

  get editorProps(): PropsServicePricingEditor {
    return new PropsServicePricingEditor(this.servicePricingForEditor.value, this.isAddingService.value)
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Harga" : "Pricing"
  }

  get groupedServicePricingProps(): PropsGroupedServicePricing {
    let labelItems = this.getApplicationsForModules(this.moduleInView.value)

    return new PropsGroupedServicePricing(this.moduleInView.value, labelItems)
  }

  get isShowingAnyModule(): boolean {
    return !StringUtil.isNullOrEmpty(this.moduleInView.value.id)
  }
}
