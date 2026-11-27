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
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CompanyConstants } from "~/scripts/constants/Company"

export class CreateNewApplicationController extends BasePopupController {
  repository: Ref<IRepositoryStore | null> = ref<IRepositoryStore | null>(null)

  target: Ref<string> = ref<string>("")

  searchTextCompany: Ref<string> = ref<string>("")
  searchTextDirector: Ref<string> = ref<string>("")

  selectedCompanyId: Ref<string> = ref<string>("")
  companies: Ref<Company[]> = ref<Company[]>([])

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  selectedDirectorId: Ref<string> = ref<string>("")

  isFetchingCompanies: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)
  isFetchingDirectors: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsCreateNewApplication, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false

    this.setDataFromProps(props)
    this.fetchCompanies()
  }

  setDataFromProps(props: PropsCreateNewApplication): void {
    this.repository.value = props.repository
    this.target.value = props.target
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

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.selectedCompanyId.value) || !this.isDirectorListRequired) {
      return
    }

    this.isFetchingDirectors.value = true

    try {
      let repository = useDirectorStore()
      let response = await repository.fetchAllForCompany(this.selectedCompanyId.value)

      this.directors.value = response.map((d: any) => {
        return new Director(d)
      })
    } catch (e) {
      this.directors.value = []
    } finally {
      this.isFetchingDirectors.value = false
    }
  }

  async onSelected(companyId: string): Promise<void> {
    this.selectedCompanyId.value = companyId

    if (this.isDirectorListRequired) {
      await this.fetchDirectors()
    }
  }

  onSearchCompany(searchText: string): void {
    this.searchTextCompany.value = searchText
  }

  onSearchDirector(searchText: string): void {
    this.searchTextDirector.value = searchText
  }

  onSelectedDirector(directorId: string): void {
    this.selectedDirectorId.value = directorId
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
        director_id: "",
      }

      if (this.isDirectorListRequired) {
        data.director_id = this.selectedDirectorId.value
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
      Select a Company:
    `
  }

  get directorLabel(): string {
    if (this.language.isMalay()) {
      return `
        Pilih Pengarah:
      `
    }

    return `
      Select a Director:
    `
  }

  get companyOptions(): SelectOption[] {
    return this.companies.value
      .filter((c: Company) => {
        if (!StringUtil.isNullOrEmpty(this.searchTextCompany.value)) {
          return StringUtil.contains(c.name, this.searchTextCompany.value)
        }

        return true
      })
      .map((c: Company) => {
        return new SelectOption(c.id, c.id, c.name, false, c.id === this.selectedCompanyId.value)
      })
  }

  get directorOptions(): SelectOption[] {
    if (this.isFetchingDirectors.value) {
      return [new SelectOption("", "", "Loading List of Directors...")]
    }

    if (StringUtil.isNullOrEmpty(this.selectedCompanyId.value)) {
      return [new SelectOption("", "", "Select a Company")]
    }

    return this.directors.value
      .filter((d: Director) => {
        if (StringUtil.isNullOrEmpty(this.searchTextDirector.value)) {
          return true
        }

        return StringUtil.contains(d.name, this.searchTextDirector.value)
      })
      .map((d: Director) => {
        return new SelectOption(d.id, d.id, d.name)
      })
  }

  get selectedCompanyName(): string {
    let matched =
      this.companies.value.find((c: Company) => {
        return c.id === this.selectedCompanyId.value
      }) ?? null

    return matched?.name ?? "(Select a Company)"
  }

  get selectedDirectorName(): string {
    let matched =
      this.directors.value.find((d: Director) => {
        return d.id === this.selectedDirectorId.value
      }) ?? null

    return matched?.name ?? "(Select a Director)"
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

  get isDirectorListRequired(): boolean {
    return this.target.value === CompanyConstants.TARGET_DIRECTOR_RESIGNATION
  }
}
