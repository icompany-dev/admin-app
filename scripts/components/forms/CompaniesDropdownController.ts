import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import type { PropsCompaniesDropdown } from "~/scripts/props/PropsCompaniesDropdown"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"

export class CompaniesDropdownController {
  searchText: Ref<string> = ref<string>("")
  isFetchingCompanies: Ref<boolean> = ref<boolean>(false)
  companies: Ref<Company[]> = ref<Company[]>([])

  isMultipleSelect: Ref<boolean> = ref<boolean>(false)
  selectedCompanyIds: Ref<string[]> = ref<string[]>([])
  placeholder: Ref<string> = ref<string>("")

  isShowOptions: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()

  constructor(props: PropsCompaniesDropdown, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
    this.fetchCompanies()
  }

  setDataFromProps(props: PropsCompaniesDropdown): void {
    this.isMultipleSelect.value = props.isMultipleSelect
    this.selectedCompanyIds.value = props.selectedCompanyIds
    this.placeholder.value = props.placeholder
  }

  async fetchCompanies(): Promise<void> {
    if (this.isFetchingCompanies.value) {
      return
    }

    try {
      this.isFetchingCompanies.value = true

      let repository = useCompanyStore()
      let response = await repository.fetchCompact("take_all=1")

      if (Array.isArray(response)) {
        this.companies.value = response.map((d: any) => {
          return new Company(d)
        })
      } else {
        this.companies.value = Object.values(response).map((d: any) => {
          return new Company(d)
        })
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.title = this.language.isMalay() ? "" : ""
      }
    } finally {
      this.isFetchingCompanies.value = false
    }
  }

  onShowItemsClicked(): void {
    this.isShowOptions.value = !this.isShowOptions.value
  }

  isSelected(companyId: string): boolean {
    return this.selectedCompanyIds.value.some((s: string) => {
      return s === companyId
    })
  }

  onOptionClicked(companyId: string): void {
    if (this.isSelected(companyId)) {
      return
    }

    this.selectedCompanyIds.value.push(companyId)

    this.emitEvents("selected", this.selectedCompanyIds.value)
  }

  onRemoveSelected(companyId: string): void {
    this.selectedCompanyIds.value = this.selectedCompanyIds.value.filter((s: string) => {
      return s !== companyId
    })

    this.emitEvents("selected", this.selectedCompanyIds.value)
  }

  get companyOptions(): SelectOption[] {
    return this.companies.value
      .filter((c: Company) => {
        if (this.isSelected(c.id)) {
          return false
        }

        if (StringUtil.isNullOrEmpty(this.searchText.value)) {
          return true
        }

        return (
          StringUtil.contains(c.name, this.searchText.value) ||
          StringUtil.contains(c.registrationNumberOld, this.searchText.value) ||
          StringUtil.contains(c.registrationNumberNew, this.searchText.value)
        )
      })
      .map((c: Company) => {
        return new SelectOption(c.id, c.id, c.getFullName())
      })
  }

  get hasSelectedAny(): boolean {
    return this.selectedCompanyIds.value.length > 0
  }

  get selectedNames(): SelectOption[] {
    if (this.selectedCompanyIds.value.length <= 0) {
      return [new SelectOption("", "", this.placeholder.value)]
    }

    return this.companies.value
      .filter((c: Company) => {
        return this.selectedCompanyIds.value.some((s: string) => {
          return s === c.id
        })
      })
      .map((c: Company) => {
        return new SelectOption(c.id, c.id, c.getFullName())
      })
  }
}
