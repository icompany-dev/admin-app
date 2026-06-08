import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"

export class SelectedSdnBhdController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  async setCompanyId(companyId: string): Promise<void> {
    if (this.companyId.value === companyId) {
      return
    }

    this.companyId.value = companyId
    await this.fetchCompany()
  }

  async fetchCompany(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.company.value = new Company()
      return
    }

    try {
      this.isLoading.value = true

      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.company.value = new Company(response)
    } catch (e) {
      this.company.value = new Company()
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
}
