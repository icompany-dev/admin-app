import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyDividendDeclarationStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"

export class DividendDeclarationController
  extends ServiceController
  implements IServiceController<CompanyDividendDeclaration, ReturnType<typeof useCompanyDividendDeclarationStore>>
{
  application: CompanyDividendDeclaration = new CompanyDividendDeclaration()
  applicationId: string | null = null
  repository = useCompanyDividendDeclarationStore()
  companyRepository = useCompanyStore()

  yearToLodge: Ref<string> = ref<string>("")

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_DIVIDEND_DECLARATION, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDividendDeclaration(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
    this.hasPaid.value =
      this.application.status !== StatusConstants.DRAFT && this.application.status !== StatusConstants.PENDING
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDividendDeclaration()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyDividendDeclaration(updatedData)
        this.application.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForCUD()
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
    return this.language.isMalay() ? "Resolusi Pengarah bagi Mengisytihar Dividen" : "DCR to Declare Dividend"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return ``
    }

    return ``
  }
}
