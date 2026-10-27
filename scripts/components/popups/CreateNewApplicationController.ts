import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { Toast } from "~/scripts/library/Toast"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"
import { PropsCreateNewApplication } from "~/scripts/props/PropsCreateNewApplication"

export class CreateNewApplicationController extends BasePopupController {
  repository: Ref<IRepositoryStore | null> = ref<IRepositoryStore | null>(null)

  searchText: Ref<string> = ref<string>("")

  selectedCompanyId: Ref<string> = ref<string>("")
  companies: Ref<Company[]> = ref<Company[]>([])

  isFetchingCompanies: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsCreateNewApplication, emitEvents: any) {
    super(emitEvents)

    this.setDataFromProps(props)
    this.fetchCompanies()
  }

  setDataFromProps(props: PropsCreateNewApplication): void {
    this.repository.value = props.repository
  }

  async fetchCompanies(): Promise<void> {
    if (this.isFetchingCompanies.value) {
      return
    }

    this.companies.value = []

    try {
      this.isFetchingCompanies.value = true
      let repository = useCompanyStore()

      let response = await repository.fetchCompact("take_all=1")
      this.companies.value = response.map((d: any) => {
        return new Company(d)
      })
    } catch (e) {
      //
    } finally {
      this.isFetchingCompanies.value = false
    }
  }

  onSelected(companyId: string): void {
    this.selectedCompanyId.value = companyId
  }

  onSearch(searchText: string): void {
    this.searchText.value = searchText
  }

  async onProceedClicked(): Promise<void> {
    if (this.isSubmitting.value || !this.repository.value || !this.canProceed) {
      return
    }

    try {
      this.isSubmitting.value = true
      // NOTE: most service we just need these two. if there are others, just target the exclusion
      let data = {
        company_id: this.selectedCompanyId.value,
        status: "draft",
      }

      await this.repository.value.create(data)

      this.emitEvents(EmitMessages.PROCEED)

      let toastTitle = this.language.isMalay() ? "Permohonan Baharu ditambah" : "New Application is Added"
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.hide()
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
      this.isSubmitting.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Permohonan Baharu` : `Create New Application`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Pilih Syarikat:
      `
    }

    return `
      Select A Company:
    `
  }

  get companyOptions(): SelectOption[] {
    return this.companies.value
      .filter((c: Company) => {
        if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
          return StringUtil.contains(c.name, this.searchText.value)
        }

        return true
      })
      .map((c: Company) => {
        return new SelectOption(c.id, c.id, c.getFullName(), false, c.id === this.selectedCompanyId.value)
      })
  }

  get selectedCompanyName(): string {
    let matched =
      this.companies.value.find((c: Company) => {
        return c.id === this.selectedCompanyId.value
      }) ?? null

    return matched?.getFullName() ?? "(Select a Company)"
  }

  get canProceed(): boolean {
    return !StringUtil.isNullOrEmpty(this.selectedCompanyId.value)
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Senarai Syarikat" : "List of Companies"
  }
}
