import { PageController } from "./PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsAnalyticsDistribution } from "../props/PropsAnalyticsDistribution"

export class PageAnalyticsController extends PageController {
  totalNumberOfCompanies: Ref<number> = ref<number>(0)
  companiesByIncorpDate: Ref<any> = ref<any>({})
  companiesByLocation: Ref<any> = ref<any>({})
  totalIncorporated: Ref<number> = ref<number>(0)
  totalSwitched: Ref<number> = ref<number>(0)
  companiesByDateJoined: Ref<any> = ref<any>({})

  totalNumberOfUsers: Ref<number> = ref<number>(0)
  usersByAgeGroup: Ref<any> = ref<any>({})
  usersByCitizenship: Ref<any> = ref<any>({})
  usersByGender: Ref<any> = ref<any>({})
  usersByRace: Ref<any> = ref<any>({})
  usersByDateJoined: Ref<any> = ref<any>({})
  totalSignUpsThisMonth: Ref<number> = ref<number>(0)

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor() {
    let title: string = "Analytics Dashboard - iCompany Malaysia"
    let description: string = "Analytics Dashboard"

    super(title, description, "")

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchCompanyAnalytics(), this.fetchUserAnalytics()])
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompanyAnalytics(): Promise<void> {
    let repository = useAnalyticsStore()
    let response = await repository.fetchCompanyCounts()

    this.totalNumberOfCompanies.value = response?.number_of_compnies ?? 0
    this.companiesByIncorpDate.value = response.by_incorp_date ?? 0
    this.companiesByLocation.value = response.by_location ?? 0
    this.totalIncorporated.value = response.number_incorp_with_icompany ?? 0
    this.totalSwitched.value = response.number_switch_to_icompany ?? 0
    this.companiesByDateJoined.value = response.by_date_joined ?? 0
  }

  async fetchUserAnalytics(): Promise<void> {
    let repository = useAnalyticsStore()
    let response = await repository.fetchUserCounts()

    this.totalNumberOfUsers.value = response.number_of_users
    this.usersByAgeGroup.value = response.by_age_group
    this.usersByCitizenship.value = response.by_citizenship
    this.usersByGender.value = response.by_gender
    this.usersByRace.value = response.by_race
    this.usersByDateJoined.value = response.by_date_joined

    let dayjs = useDayjs()
    let thisMonth = dayjs().format("YYYY-MM")
    this.totalSignUpsThisMonth = response.by_date_joined[thisMonth] ?? 0
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([
      new PropsBreadCrumbItem("Command Centre", ""),
      new PropsBreadCrumbItem("Analytics", ""),
    ])
  }

  get analyticDistributionProps(): PropsAnalyticsDistribution {
    let props = new PropsAnalyticsDistribution()

    props.totalNumberOfCompanies = this.totalNumberOfCompanies.value
    props.companiesByIncorpDate = this.companiesByIncorpDate.value
    props.companiesByLocation = this.companiesByLocation.value
    props.totalIncorporated = this.totalIncorporated.value
    props.totalSwitched = this.totalSwitched.value
    props.companiesByDateJoined = this.companiesByDateJoined.value
    props.totalNumberOfUsers = this.totalNumberOfUsers.value
    props.usersByAgeGroup = this.usersByAgeGroup.value
    props.usersByCitizenship = this.usersByCitizenship.value
    props.usersByGender = this.usersByGender.value
    props.usersByRace = this.usersByRace.value
    props.usersByDateJoined = this.usersByDateJoined.value
    props.totalSignUpsThisMonth = this.totalSignUpsThisMonth.value
    props.isLoading = this.isLoading.value

    return props
  }
}
