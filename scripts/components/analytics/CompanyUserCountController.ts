import { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

export class CompanyUserCountController {
  emitEvents: any | null = null

  totalNumberOfCompanies: Ref<number> = ref<number>(0)
  totalIncorporated: Ref<number> = ref<number>(0)
  totalSwitched: Ref<number> = ref<number>(0)
  totalNumberOfUsers: Ref<number> = ref<number>(0)
  totalSignUpsThisMonth: Ref<number> = ref<number>(0)

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.totalNumberOfCompanies.value = props.totalNumberOfCompanies
    this.totalIncorporated.value = props.totalIncorporated
    this.totalSwitched.value = props.totalSwitched
    this.totalNumberOfUsers.value = props.totalNumberOfUsers
    this.totalSignUpsThisMonth.value = props.totalSignUpsThisMonth

    this.isLoading.value = props.isLoading
  }

  get currentMonth(): string {
    let dayjs = useDayjs()

    return dayjs().format("MMM YYYY")
  }
}
