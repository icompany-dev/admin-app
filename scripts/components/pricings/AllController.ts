import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { Label } from "~/scripts/models/Label"
import { LabelItem } from "~/scripts/models/LabelItem"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { PropsServicePricingEditor } from "~/scripts/props/PropsServicePricingEditor"
import { StringUtil } from "~/scripts/utils/String"

export class AllController {
  modules: Ref<Label[]> = ref<Label[]>([])
  moduleApplications: Ref<LabelItem[]> = ref<LabelItem[]>([])

  emitEvents: any | null = null

  editorRef: any | null = null
  confirmToDeleteRef: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  servicePricingForEditor: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  moduleToRemove: Ref<Label> = ref<Label>(new Label())

  moduleInView: Ref<Label> = ref<Label>(new Label())

  isAddingNewModule: Ref<boolean> = ref<boolean>(false)
  isSubmittingNewModule: Ref<boolean> = ref<boolean>(false)
  newModule: Ref<Label> = ref<Label>(new Label())

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

  onAddNewModuleClicked(): void {
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

      let toastTitle = this.language.isMalay() ? "Tema Baharu telah ditambah." : "The New Theme is added."
      let toastMessage = this.language.isMalay()
        ? "Anda boleh tambah item ke dalam Tema baharu."
        : "You can add items to the Theme."
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

  //getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Modul" : "Modules"
  }

  get editorProps(): PropsServicePricingEditor {
    return new PropsServicePricingEditor(this.servicePricingForEditor.value)
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Harga" : "Pricing"
  }
}
