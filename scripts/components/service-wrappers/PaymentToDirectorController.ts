import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyDirectorPaymentStore } from "~/stores/CompanyDirectorPayments"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class PaymentToDirectorController
  extends ServiceController
  implements IServiceController<CompanyDirectorPayment, ReturnType<typeof useCompanyDirectorPaymentStore>>
{
  application = ref<CompanyDirectorPayment>(new CompanyDirectorPayment())
  applicationId: string | null = null
  repository = useCompanyDirectorPaymentStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_DIRECTOR_PAYMENT, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application.value = new CompanyDirectorPayment(response)
      this.applicationId = id
      this.targetId = id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    this.application.value = new CompanyDirectorPayment()
    this.application.value.companyId = companyId

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  onDcrApplicationUpdated(): void {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()

      if (this.mcrRef) {
        this.mcrRef.onDataChanged(updatedData)
      }
    }
  }

  onMcrApplicationUpdated(): void {
    if (this.mcrRef) {
      let updatedData = this.mcrRef.getApplication()

      if (this.dcrRef) {
        this.dcrRef.onDataChanged(updatedData)
      }
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application.value = new CompanyDirectorPayment(updatedData)
        this.application.value.id = this.applicationId ?? ""
      } else {
        let updatedData = this.mcrRef.getApplication()
        this.application.value = new CompanyDirectorPayment(updatedData)
        this.application.value.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application.value)

      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application.value)
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
    await this.application.value.create(this.repository)
    this.applicationId = this.application.value.id
    this.targetId = this.application.value.id
  }

  async onUpdate(): Promise<void> {
    await this.application.value.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back", this.application.value)
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.value.remove(this.repository)
    this.emitEvents("back", this.application.value)
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
      return "READY FOR DELIVERY"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyDirectorPayment>(
      this.companyId,
      this.application.value.id,
      null,
      this.isShowWatermark,
      this.watermarkText,
      false,
      false
    )

    props.isShowTag = this.application.value.signatureGroups.length <= 0

    props.type = this.application.value.typeOfPayment

    return props
  }

  get isShowMcrFirst(): boolean {
    let route = useRoute()

    return route.fullPath.includes("shareholders")
  }
}
