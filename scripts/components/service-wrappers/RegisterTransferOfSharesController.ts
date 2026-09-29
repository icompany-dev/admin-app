import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyPostShareTransferStore } from "~/stores/CompanyPostShareTransfers"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class RegisterTransferOfSharesController
  extends ServiceController
  implements IServiceController<CompanyPostShareTransfer, ReturnType<typeof useCompanyPostShareTransferStore>>
{
  application: CompanyPostShareTransfer = new CompanyPostShareTransfer()
  applicationRef = ref<CompanyPostShareTransfer>(new CompanyPostShareTransfer())
  applicationId: string | null = null
  repository = useCompanyPostShareTransferStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    this.applicationId = id
    this.targetId = id
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyPostShareTransfer(response)
      this.applicationRef.value = new CompanyPostShareTransfer(response)
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyPostShareTransfer()
      this.application.companyId = companyId
      this.application.company = new Company(response)

      this.applicationRef.value = new CompanyPostShareTransfer(this.application)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isADirector.value) {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyPostShareTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    } else if (this.isAShareholder.value) {
      if (this.mcrRef) {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyPostShareTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    }

    try {
      this.emitEvents("back", this.application)
      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
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
    return new PropsResolutionDocument<CompanyPostShareTransfer>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyPostShareTransfer,
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
