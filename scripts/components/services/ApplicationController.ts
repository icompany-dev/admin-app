import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { Application } from "~/scripts/models/Application"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { StringUtil } from "~/scripts/utils/String"

export abstract class ApplicationController<Application> {
  companyId: Ref<string> = ref<string>("")

  applications = ref<Application[]>([])
  application = ref<Application | null>(null)

  repository: IRepositoryStore

  applicationClassType: new (data: any) => Application

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    repository: IRepositoryStore,
    applicationClassType: new (data: any) => Application,
    emitEvents: any | null
  ) {
    this.repository = repository
    this.applicationClassType = applicationClassType
    this.companyId.value = companyId

    this.application.value = new this.applicationClassType(null)

    this.emitEvents = emitEvents
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await this.fetchOngoing()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.fetchOngoing()
  }

  async fetchOngoing(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.application.value = new this.applicationClassType(null)
    }

    let response = await this.repository.ongoing(this.companyId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.application.value = new this.applicationClassType(response)
  }

  // getters
  abstract get serviceName(): string

  get hasApplication(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.application.value.id) &&
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get serviceApplicationProps(): PropsServiceApplication {
    return new PropsServiceApplication(this.serviceName, this.hasApplication)
  }
}
