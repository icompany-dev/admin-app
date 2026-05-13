export interface IPropsCommandCentreStatistic {
  statuses: string[]
  selectedStatus: string
  title: string
  count: number
  periods: string[]
  selectedPeriod: string
}

export class PropsCommandCentreStatistic implements IPropsCommandCentreStatistic {
  statuses: string[] = []
  selectedStatus: string = ""
  title: string = ""
  count: number = 0
  periods: string[] = []
  selectedPeriod: string = ""

  constructor(
    statuses: string[],
    selectedStatus: string,
    title: string,
    count: number,
    periods: string[],
    selectedPeriod: string
  ) {
    this.statuses = statuses
    this.selectedStatus = selectedStatus
    this.title = title
    this.count = count
    this.periods = periods
    this.selectedPeriod = selectedPeriod
  }
}
