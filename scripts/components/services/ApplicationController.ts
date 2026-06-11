import { Error } from "~/scripts/library/Error"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { StringUtil } from "~/scripts/utils/String"

export abstract class ApplicationController<T> {
  companyId: Ref<string> = ref<string>("")

  applications = ref<T[]>([])
  application = ref<T | null>(null)

  repository: IRepositoryStore

  applicationClassType: new (data: any) => T

  language = useLanguage()
  dayjs = useDayjs()
  time = useLocalTime()

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    repository: IRepositoryStore,
    applicationClassType: new (data: any) => T,
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
}
