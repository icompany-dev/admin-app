import type { IPropsCommandCentreStatistic } from "~/scripts/props/PropsCommandCentreStatistic"
import { StringUtil } from "~/scripts/utils/String"

export class StatisticController {
  statuses: Ref<string[]> = ref<string[]>([])
  selectedStatus: Ref<string> = ref<string>("")
  isShowStatusOptions: Ref<boolean> = ref<boolean>(false)

  title: Ref<string> = ref<string>("")
  count: Ref<number> = ref<number>(0)

  periods: Ref<string[]> = ref<string[]>([])
  selectedPeriod: Ref<string> = ref<string>("")
  isShowPeriodOptions: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  emitEvents: any | null = null

  constructor(props: IPropsCommandCentreStatistic, emitEvents: any) {
    this.statuses.value = props.statuses
    this.selectedStatus.value = props.selectedStatus
    this.title.value = props.title
    this.count.value = props.count
    this.periods.value = props.periods
    this.selectedPeriod.value = props.selectedPeriod
    this.emitEvents = emitEvents
  }

  setStatuses(statuses: string[]): void {
    this.statuses.value = statuses
  }

  setSelectedStatus(selectedStatus: string): void {
    this.selectedStatus.value = selectedStatus
  }

  setTitle(title: string): void {
    this.title.value = title
  }

  setCount(count: number): void {
    this.count.value = count
  }

  setPeriods(periods: string[]): void {
    this.periods.value = periods
  }

  setSeletedPeriod(selectedPeriod: string): void {
    this.selectedPeriod.value = selectedPeriod
  }

  onSelectStatus(value: string): void {
    this.emitEvents("statusSelected", value)
    this.isShowStatusOptions.value = false
  }

  onSelectPeriod(value: string): void {
    this.emitEvents("periodSelected", value)
    this.isShowPeriodOptions.value = false
  }

  onStatusSelectionClicked(): void {
    this.isShowPeriodOptions.value = false
    this.isShowStatusOptions.value = !this.isShowStatusOptions.value
  }

  onPeriodSelectionClicked(): void {
    this.isShowStatusOptions.value = false
    this.isShowPeriodOptions.value = !this.isShowPeriodOptions.value
  }

  hideOptions(): void {
    this.isShowStatusOptions.value = false
    this.isShowPeriodOptions.value = false
  }

  get status(): string {
    return StringUtil.capitalize(this.selectedStatus.value)
  }

  get periodPrepend(): string {
    return this.language.isMalay() ? "bagi" : "for this"
  }

  get periodAppend(): string {
    return this.language.isMalay() ? "ini" : ""
  }
}
