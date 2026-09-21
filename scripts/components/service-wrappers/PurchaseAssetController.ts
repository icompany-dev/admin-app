import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAssetPurchaseStore } from "~/stores/CompanyAssetPurchases"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class PurchaseAssetController
  extends ServiceController
  implements IServiceController<CompanyAssetPurchase, ReturnType<typeof useCompanyAssetPurchaseStore>>
{
  application = ref<CompanyAssetPurchase>(new CompanyAssetPurchase())
  applicationId: string | null = null
  repository = useCompanyAssetPurchaseStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_PURCHASE_ASSET, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application.value = new CompanyAssetPurchase(response)
      this.applicationId = id
      this.targetId = id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    this.application.value = new CompanyAssetPurchase()
    this.application.value.companyId = companyId

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    // if (this.isADirector.value) {
    //   if (this.dcrRef) {
    //     let updatedData = this.dcrRef.getApplication()
    //     this.application.value = new CompanyAssetPurchase(updatedData)
    //     this.application.value.id = this.applicationId ?? ""
    //   }
    // } else if (this.isAShareholder.value) {
    //   if (this.mcrRef) {
    //     let updatedData = this.mcrRef.getApplication()
    //     this.application.value = new CompanyAssetPurchase(updatedData)
    //     this.application.value.id = this.applicationId ?? ""
    //   }
    // }
    // try {
    //   this.emitEvents("back", this.application)
    //   await this.onUpdate()
    //   let isSignatureSubmitted = false
    //   if (this.isADirector.value || this.isAShareholder.value) {
    //     await this.submitSignature()
    //     isSignatureSubmitted = true
    //   }
    //   if (isSignatureSubmitted) {
    //     this.onSignatureSuccess()
    //   } else {
    //     this.onApplicationUpdated()
    //   }
    //   this.emitEvents("applicationUpdated", this.application.value)
    // } catch (error: any) {
    //   if (error instanceof Error) {
    //     error.handle()
    //   } else {
    //     let errorMessage: Error = new Error("", "")
    //     errorMessage.setForFetch()
    //     errorMessage.handle()
    //   }
    // }
  }

  async onCreate(): Promise<void> {
    await this.application.value.create(this.repository)
    this.applicationId = this.application.value.id
    this.targetId = this.application.value.id
  }

  async onUpdate(): Promise<void> {
    await this.application.value.update(this.repository)
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

  get isShowWatermark(): boolean {
    if (
      this.application.value.status === StatusConstants.DRAFT ||
      this.application.value.status === StatusConstants.PENDING
    ) {
      return true
    }

    return this.application.value.signatureGroups.length <= 0
  }

  get watermarkText(): string {
    if (!this.isShowWatermark) {
      return ""
    }

    if (
      this.application.value.status === StatusConstants.DRAFT ||
      this.application.value.status === StatusConstants.PENDING
    ) {
      return "PREVIEW"
    }

    if (this.application.value.status === StatusConstants.READY) {
      return "READY TO SHIP"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAssetPurchase>(
      this.companyId,
      this.applicationId,
      this.application.value as CompanyAssetPurchase,
      this.isShowWatermark,
      this.watermarkText,
      false,
      false
    )
  }
}
