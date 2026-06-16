import { CompanySection47 } from "~/scripts/models/CompanySection47"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanySection47Store } from "~/stores/CompanySection47"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"

export class Section47Controller
  extends ServiceController
  implements IServiceController<CompanySection47, ReturnType<typeof useCompanySection47Store>>
{
  application: CompanySection47 = new CompanySection47()
  applicationId: string | null = null
  repository = useCompanySection47Store()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SECTION_47, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    if (this.repository.isLoading) {
      setTimeout(() => {
        this.fetchApplication(id)
      }, 1000)
      return
    }

    await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanySection47(this.repository.companySection47s)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    if (this.companyRepository.isLoading) {
      setTimeout(() => {
        this.setApplication(companyId)
      }, 1000)
      return
    }

    await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanySection47()
      this.application.companyId = companyId
      this.application.company = new Company(this.companyRepository.company)
    }
  }

  async onSigned(signatureData: string): Promise<void> {
    this.signatureFile.value = signatureData

    await this.onSubmitClicked()
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanySection47(updatedData)
    }
    
    try {
      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      if (!this.hasPaid.value) {
        await this.pay()
      }
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error(Error.ERROR_TYPE_API, error)
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Section 47`
      : "Section 47"
  }

  helpDescription(): string {
    return this.language.isMalay()
      ? `Lorem Ipsum`
      : `Lorem Ipsum`
  }
}
