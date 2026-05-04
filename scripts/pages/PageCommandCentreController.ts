import { FilterPeriod } from "../constants/FilterValues"
import { Filter } from "../library/Filter"
import { User } from "../models/User"
import { StringUtil } from "../utils/String"
import { PageController } from "./PageController"

export class PageCommandCentreController extends PageController {
  nameReservationCount: Ref<number> = ref<number>(0)
  selectedNameReservationStatus: Ref<string> = ref<string>("paid")
  selectedNameReservationPeriod: Ref<string> = ref<string>("month")

  newIncorporationCount: Ref<number> = ref<number>(0)
  selectedNewIncorporationStatus: Ref<string> = ref<string>("paid")
  selectedNewIncorporationPeriod: Ref<string> = ref<string>("month")

  reassignmentCount: Ref<number> = ref<number>(0)
  selectedReassignmentStatus: Ref<string> = ref<string>("paid")
  selectedReassignmentPeriod: Ref<string> = ref<string>("month")

  usersCount: Ref<number> = ref<number>(0)
  selectedUsersStatus: Ref<string> = ref<string>("paid")
  selectedUsersPeriod: Ref<string> = ref<string>("month")
  users = ref<User[]>([])

  nameReservationStatisticRef: any | null = null
  newIncorporationStatisticRef: any | null = null
  reassignmentStatisticRef: any | null = null
  usersStatisticRef: any | null = null

  dayjs = useDayjs()
  time = useLocalTime()

  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "")

    this.init()
  }

  async init(): Promise<void> {
    this.fetchNewIncorporations()
    this.fetchUsers()
    this.fetchNewSwitches()
  }

  setNameReservationStatisticRef(nameReservationStatisticRef: any): void {
    this.nameReservationStatisticRef = nameReservationStatisticRef
  }

  setNewIncorporationStatisticRef(newIncorporationStatisticRef: any): void {
    this.newIncorporationStatisticRef = newIncorporationStatisticRef
  }

  setReassignmentStatisticRef(reassignmentStatisticRef: any): void {
    this.reassignmentStatisticRef = reassignmentStatisticRef
  }

  setUsersStatisticRef(usersStatisticRef: any): void {
    this.usersStatisticRef = usersStatisticRef
  }

  handleOutsideClicks(): void {
    if (this.nameReservationStatisticRef) {
      this.nameReservationStatisticRef.hideOptions()
    }

    if (this.newIncorporationStatisticRef) {
      this.newIncorporationStatisticRef.hideOptions()
    }

    if (this.reassignmentStatisticRef) {
      this.reassignmentStatisticRef.hideOptions()
    }

    if (this.usersStatisticRef) {
      this.usersStatisticRef.hideOptions()
    }
  }

  async fetchNewIncorporations(): Promise<void> {
    let repository = useApplicationIncorporateStore()
    let filter = new Filter()
    filter.statuses = [this.selectedNewIncorporationStatus.value]
    if (this.selectedNewIncorporationStatus.value !== "paid") {
      filter.includeDeleted = true
    }
    filter.startDate = this.startDateForPeriod(this.selectedNewIncorporationPeriod.value)
    filter.endDate = this.endDateForPeriod(this.selectedNewIncorporationPeriod.value)
    filter.take = 1

    let response = await repository.fetchAll(filter)
    this.newIncorporationCount.value = response.totalRecords
  }

  async fetchNewSwitches(): Promise<void> {
    let repository = useApplicationSwitchStore()
    let filter = new Filter()
    filter.statuses = [this.selectedReassignmentStatus.value]
    if (this.selectedReassignmentStatus.value !== "paid") {
      filter.includeDeleted = true
    }
    filter.startDate = this.startDateForPeriod(this.selectedReassignmentPeriod.value)
    filter.endDate = this.endDateForPeriod(this.selectedReassignmentPeriod.value)
    filter.take = 1

    let response = await repository.fetchAll(filter)
    this.reassignmentCount.value = response.totalRecords
  }

  async fetchUsers(): Promise<void> {
    let repository = useUserStore()
    let filter = new Filter()
    filter.startDate = this.startDateForPeriod(this.selectedUsersPeriod.value)
    filter.endDate = this.endDateForPeriod(this.selectedUsersPeriod.value)
    filter.takeAll = true

    let response = await repository.fetchAll(filter)
    this.users.value = response.data.map((d: any) => {
      return new User(d)
    })

    if (this.selectedUsersStatus.value === "registered") {
      this.usersCount.value = this.users.value.filter((u: User) => {
        return u.detail !== null && !StringUtil.isNullOrEmpty(u.detail.identification)
      }).length
    } else {
      this.usersCount.value = this.users.value.filter((u: User) => {
        return u.detail === null || StringUtil.isNullOrEmpty(u.detail.identification)
      }).length
    }
  }

  async onNameReservationStatusSelected(value: string): Promise<void> {
    this.selectedNameReservationStatus.value = value
  }

  async onNameReservationPeriodSelected(value: string): Promise<void> {
    this.selectedNameReservationPeriod.value = value
  }

  async onNewIncorporationStatusSelected(value: string): Promise<void> {
    this.selectedNewIncorporationStatus.value = value
    await this.fetchNewIncorporations()
  }

  async onNewIncorporationPeriodSelected(value: string): Promise<void> {
    this.selectedNewIncorporationPeriod.value = value
    await this.fetchNewIncorporations()
  }

  async onReassignmentStatusSelected(value: string): Promise<void> {
    this.selectedReassignmentStatus.value = value
    await this.fetchNewSwitches()
  }

  async onReassignmentPeriodSelected(value: string): Promise<void> {
    this.selectedReassignmentPeriod.value = value
    await this.fetchNewSwitches()
  }

  async onUserStatusSelected(value: string): Promise<void> {
    this.selectedUsersStatus.value = value

    if (this.selectedUsersStatus.value === "registered") {
      this.usersCount.value = this.users.value.filter((u: User) => {
        return u.detail !== null && !StringUtil.isNullOrEmpty(u.detail.identification)
      }).length
    } else {
      this.usersCount.value = this.users.value.filter((u: User) => {
        return u.detail === null || StringUtil.isNullOrEmpty(u.detail.identification)
      }).length
    }
  }

  async onUserPeriodSelected(value: string): Promise<void> {
    this.selectedUsersPeriod.value = value
    await this.fetchUsers()
  }

  startDateForPeriod(period: string): string {
    let today = this.dayjs()
    let startDate = today.startOf("day").format("YYYY-MM-DD")
    switch (period) {
      case FilterPeriod.Week:
        startDate = today.startOf("week").format("YYYY-MM-DD")
        break
      case FilterPeriod.Month:
        startDate = today.startOf("month").format("YYYY-MM-DD")
        break
      case FilterPeriod.Quarter:
        let month = today.month()
        let monthInQuarter = Math.floor(month / 3) * 3 + 1
        startDate = `${today.year()}-${monthInQuarter}-01`
        break
      case FilterPeriod.Year:
        startDate = today.startOf("year").format("YYYY-MM-DD")
        break
    }

    return this.time.formatDateOnlySystem(startDate)
  }

  endDateForPeriod(period: string): string {
    let today = this.dayjs()
    let startDate = today.startOf("day").format("YYYY-MM-DD")

    switch (period) {
      case FilterPeriod.Week:
        startDate = today.endOf("week").format("YYYY-MM-DD")
        break
      case FilterPeriod.Month:
        startDate = today.endOf("month").format("YYYY-MM-DD")
        break
      case FilterPeriod.Quarter:
        let month = today.month()
        let monthInQuarter = Math.floor(month / 3) * 3 + 2
        let dateString = `${today.year()}-${monthInQuarter}-01`
        startDate = this.dayjs(dateString).endOf("month").format("YYYY-MM-DD")
        break
      case FilterPeriod.Year:
        startDate = today.endOf("year").format("YYYY-MM-DD")
        break
    }

    return this.time.formatDateOnlySystem(startDate)
  }

  get nameReservationLabel(): string {
    return this.language.isMalay() ? "Tempahan Nama" : "Name Reservation"
  }

  get nameReservationStatuses(): string[] {
    return ["paid", "approved", "rejected"]
  }

  get newIncorporationLabel(): string {
    return this.language.isMalay() ? "Permerbadanan" : "New Incorporation"
  }

  get newIncorporationStatuses(): string[] {
    return ["paid", "approved", "rejected"]
  }

  get reassignmentLabel(): string {
    return this.language.isMalay() ? "Pertukaran" : "Reassignment"
  }

  get reassignmentStatuses(): string[] {
    return ["paid", "approved", "rejected"]
  }

  get usersLabel(): string {
    return this.language.isMalay() ? "Pengguna" : "Users"
  }

  get userStatuses(): string[] {
    return ["registered", "draft"]
  }

  get periods(): string[] {
    return ["week", "month", "quarter", "year"]
  }
}
