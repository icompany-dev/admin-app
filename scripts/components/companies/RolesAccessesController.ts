import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { AccessRole } from "~/scripts/models/AccessRole"
import { UserAccessRole } from "~/scripts/models/UserAccessRole"
import { PropsAssignRole } from "~/scripts/props/PropsAssignRole"
import { UserRolesForCompany } from "~/scripts/types/access-rules/UserRolesForCompany"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"

export class RolesAccessesController {
  companyId: Ref<string> = ref<string>("")

  userAccessRoles: Ref<UserAccessRole[]> = ref<UserAccessRole[]>([])
  userRolesForCompany: Ref<UserRolesForCompany[]> = ref<UserRolesForCompany[]>([])
  accessRoles: Ref<AccessRole[]> = ref<AccessRole[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  isFetchingUserAccessRoles: Ref<boolean> = ref<boolean>(false)
  isFetchingUserRolesForCompany: Ref<boolean> = ref<boolean>(false)
  isFetchingAccessRoles: Ref<boolean> = ref<boolean>(false)

  filterUserAccessRoles: Filter = new Filter()
  filterAccessRoles: Filter = new Filter()

  emitEvents: any | null = null

  createAccessRoleRef: any | null = null
  assignRoleRef: any | null = null

  language = useLanguage()

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  setCreateAccessRoleRef(createAccessRoleRef: any): void {
    this.createAccessRoleRef = createAccessRoleRef
  }

  setAssignRoleRef(assignRoleRef: any): void {
    this.assignRoleRef = assignRoleRef
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    this.isLoading.value = true
    try {
      await Promise.all([this.fetchAccessRoles(), this.fetchUserAccessRoles(), this.fetchUserRolesForCompany()])
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchUserAccessRoles(): Promise<void> {
    this.isFetchingUserAccessRoles.value = true
    this.userAccessRoles.value = []
    this.filterUserAccessRoles.takeAll = true

    try {
      this.filterUserAccessRoles.companyId = this.companyId.value
      let repository = useUserAccessRoleStore()
      let response = await repository.fetchAll(this.filterUserAccessRoles)
      if (repository.error !== null) {
        throw repository.error
      }

      this.filterUserAccessRoles.totalPages = response.totalPages
      this.filterUserAccessRoles.totalRecords = response.totalRecords
      this.userAccessRoles.value = response.data.map((d: any) => {
        return new UserAccessRole(d)
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isFetchingUserAccessRoles.value = false
    }
  }

  async fetchUserRolesForCompany(): Promise<void> {
    this.isFetchingUserRolesForCompany.value = true
    this.userRolesForCompany.value = []

    try {
      let repository = useUserAccessRoleStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)
      if (repository.error !== null) {
        throw repository.error
      }
      this.userRolesForCompany.value = response.map((d: any) => {
        return new UserRolesForCompany(d)
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isFetchingUserRolesForCompany.value = false
    }
  }

  async fetchAccessRoles(): Promise<void> {
    this.isFetchingAccessRoles.value = true
    this.filterAccessRoles.takeAll = true
    this.accessRoles.value = []

    try {
      this.filterAccessRoles.companyId = this.companyId.value
      let repository = useAccessRoleStore()

      let response = await repository.fetchAll(this.filterAccessRoles)
      if (repository.error !== null) {
        throw repository.error
      }

      this.filterAccessRoles.totalPages = response.totalPages
      this.filterAccessRoles.totalRecords = response.totalRecords
      this.accessRoles.value = response.data.map((d: any) => {
        return new AccessRole(d)
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error: Error = new Error()
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isFetchingAccessRoles.value = false
    }
  }

  addNewAccessRole(): void {
    if (this.createAccessRoleRef) {
      this.createAccessRoleRef.show()
    }
  }

  async onRoleAdded(): Promise<void> {
    await this.fetchAccessRoles()
  }

  assignRole(): void {
    if (this.assignRoleRef) {
      this.assignRoleRef.show()
    }
  }

  async onRoleAssigned(): Promise<void> {
    await this.fetchUserAccessRoles()
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Peranan & Akses" : "Roles & Access"
  }

  get noRecordLabel(): string {
    return this.language.isMalay()
      ? "Sdn Bhd tidak beri akses kepada orang lain."
      : "This Sdn Bhd has not granted access to others."
  }

  get noRecordSublabel(): string {
    return this.language.isMalay()
      ? "Sebarang peranan akan dipaparkan disini jika ada."
      : "Any roles will be displayed here once available."
  }

  get hasAdditionalRoles(): boolean {
    if (this.userAccessRoles.value.length <= 0) {
      return false
    }

    return this.userAccessRoles.value.some((uar: UserAccessRole) => {
      return uar.getRoleName() !== "Director" && uar.getRoleName() !== "Shareholder"
    })
  }

  get nonDirectorsAndShareholders(): UserAccessRole[] {
    return this.userAccessRoles.value.filter((uar: UserAccessRole) => {
      return uar.getRoleName() !== "Director" && uar.getRoleName() !== "Shareholder"
    })
  }

  get actionTrayElements(): ActionTrayElement[] {
    return [
      new ActionTrayElement("add-role", this.addNewAccessRole.bind(this), {
        label: new ActionTrayLabel("Add Role", "Tambah Peranan"),
      }),
      new ActionTrayElement("assign-role", this.assignRole.bind(this), {
        label: new ActionTrayLabel("Grant Access", "Beri Akses"),
      }),
    ]
  }

  get assignRoleProps(): PropsAssignRole {
    return new PropsAssignRole(this.companyId.value, this.accessRoles.value)
  }
}
