import { Filter } from "~/scripts/library/Filter"
import { MsicCode } from "~/scripts/models/MsicCode"
import { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"
import type { PropsAssignMsicCode } from "~/scripts/props/PropsAssignMsicCode"
import { SelectOption } from "~/scripts/types/SelectOption"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class AssignMsicCodeController {
  msicCodeAssign: Ref<MsicCodeAssign> = ref<MsicCodeAssign>(new MsicCodeAssign())

  msicCodes: Ref<MsicCode[]> = ref<MsicCode[]>([])

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)
  searchText: Ref<string> = ref<string>("")

  constructor(props: PropsAssignMsicCode, emitEvents: any) {
    this.emitEvents = emitEvents
    this.setDataFromProps(props)

    this.fetchMsicCodes()
  }

  setDataFromProps(props: PropsAssignMsicCode): void {
    this.msicCodeAssign.value = new MsicCodeAssign()
    this.msicCodeAssign.value.assign.target = props.target
    this.msicCodeAssign.value.assign.id = props.targetId
  }

  async fetchMsicCodes(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.msicCodes.value = []
    this.isLoading.value = true
    try {
      let filter = new Filter()
      filter.takeAll = true

      let repository = useMsicCodeStore()
      let response = await repository.fetchAll(filter)

      let unorderedData = response.data.map((d: any) => {
        return new MsicCode(d)
      })

      this.msicCodes.value = ObjectUtil.sort<MsicCode>(unorderedData, "categoryCode", "asc")
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  onSelectedMsicCode(selectedMsicCodeId: string): void {
    this.msicCodeAssign.value.msicCode =
      this.msicCodes.value.find((m: MsicCode) => {
        return m.id === selectedMsicCodeId
      }) ?? new MsicCode()

    this.emitEvents("selected", this.msicCodeAssign.value)
  }

  onSearchText(searchText: string): void {
    this.searchText.value = searchText
  }

  get selectedMsicCodeName(): string {
    if (StringUtil.isNullOrEmpty(this.msicCodeAssign.value.msicCode.id)) {
      return "Select One"
    }

    return `${this.msicCodeAssign.value.msicCode.code} - ${this.msicCodeAssign.value.msicCode.descriptionEn}`
  }

  get msicCodeOptions(): SelectOption[] {
    if (this.isLoading.value) {
      return [new SelectOption("", "", "Retrieving MSIC Codes", true, false)]
    }

    let categories = this.msicCodes.value.map((d: MsicCode) => {
      return d.categoryCode
    })

    let uniqueCategories = [...new Set(categories)].sort()

    let options: SelectOption[] = []

    uniqueCategories.forEach((categoryCode: string) => {
      let allMsicCodes = this.msicCodes.value.filter((d: MsicCode) => {
        if (d.categoryCode !== categoryCode) {
          return false
        }

        if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
          return (
            StringUtil.contains(d.code, this.searchText.value) ||
            StringUtil.contains(d.descriptionEn, this.searchText.value)
          )
        }

        return d.categoryCode === categoryCode
      })

      if (allMsicCodes.length <= 0) {
        return
      }

      let description = allMsicCodes[0].categoryDescriptionEn
      options.push(new SelectOption("", "", description, true))

      allMsicCodes.forEach((m: MsicCode) => {
        options.push(new SelectOption(m.id, m.id, `${m.code} - ${m.descriptionEn}`))
      })
    })

    return options
  }
}
