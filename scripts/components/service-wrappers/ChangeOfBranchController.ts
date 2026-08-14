import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAmendmentBranchStore } from "~/stores/CompanyAmendmentBranches"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ChangeOfBranchController
  extends ServiceController
  implements IServiceController<CompanyAmendmentBranch, ReturnType<typeof useCompanyAmendmentBranchStore>>
{
  application: CompanyAmendmentBranch = new CompanyAmendmentBranch()
  applicationRef = ref<CompanyAmendmentBranch>(new CompanyAmendmentBranch())
  applicationId: string | null = null
  repository = useCompanyAmendmentBranchStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AMENDMENT_BRANCH, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    this.applicationId = id
    this.targetId = id
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAmendmentBranch(response)
      this.applicationRef.value = new CompanyAmendmentBranch(response)
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAmendmentBranch()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyAmendmentBranch(updatedData)
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
        let errorMessage: Error = new Error()
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

  get isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentBranch>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyAmendmentBranch,
      this.isDraft,
      "DRAFT",
      false,
      false,
      null,
      null,
      [],
      null,
      null
    )
  }
}
