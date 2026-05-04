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

  nameReservationStatisticRef: any | null = null
  newIncorporationStatisticRef: any | null = null
  reassignmentStatisticRef: any | null = null
  usersStatisticRef: any | null = null

  constructor() {
    let title: string = "Admin Dashboard - iCompany Malaysia"
    let description: string = "Admin Dashboard"

    super(title, description, "")
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
    console.log(this.nameReservationStatisticRef)
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

  async onNameReservationStatusSelected(value: string): Promise<void> {
    this.selectedNameReservationStatus.value = value
  }

  async onNameReservationPeriodSelected(value: string): Promise<void> {
    this.selectedNameReservationPeriod.value = value
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
