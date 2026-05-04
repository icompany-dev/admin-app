import { ActivityRegister } from "../models/ActivityRegister"
import { User } from "../models/User"
import { AuditTrail } from "../types/AuditTrail"
import { CurrentUser } from "../utils/CurrentUser"
import { Error } from "./Error"
import { Filter } from "./Filter"

export class RegisterOfActivities {
  user: User = new User()

  activityRegisters: ActivityRegister[] = []
  auditTrails: AuditTrail[] = []
  filter: Filter = new Filter()

  isLoading: boolean = false
  companyId: string = ""

  language = useLanguage()

  constructor(companyId: string | null = null) {
    this.companyId = companyId ?? ""
    this.filter = new Filter()
    this.filter.page = 1
    this.filter.take = 20
    this.filter.takeAll = false
  }

  async init(): Promise<void> {
    this.user = await CurrentUser.get()

    await this.fetchRegisters()
  }

  async fetchRegisters(): Promise<void> {
    if (this.isLoading) {
      return
    }

    this.activityRegisters = []
    this.isLoading = true

    try {
      this.filter.companyId = this.companyId

      let repository = useActivityRegisterStore()
      let response = await repository.fetchAll(this.filter)

      if (repository.error !== null) {
        throw repository.error
      }

      this.activityRegisters = response.data.map((d: any) => {
        return new ActivityRegister(d)
      })

      this.filter.setDataFromApiRecord(response)

      this.formatActivityRegisters()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading = false
    }
  }

  formatActivityRegisters(): void {
    this.auditTrails = this.activityRegisters.map((d: ActivityRegister) => {
      let auditTrail = new AuditTrail()
      auditTrail.setDataFromActivityRegister(d, this.language.isMalay())
      return auditTrail
    })
  }
}
