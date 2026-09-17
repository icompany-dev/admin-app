import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class ChangeBankSignatoriesController
  extends ServiceController
  implements IServiceController<CompanyChangeBankSignatory, ReturnType<typeof useCompanyChangeBankSignatoryStore>>
{
  application = ref<CompanyChangeBankSignatory>(new CompanyChangeBankSignatory())
  applicationId: string | null = null
  repository = useCompanyChangeBankSignatoryStore()
  companyRepository = useCompanyStore()

  companyBankId: Ref<string> = ref<string>("")

  showMcrFirst = ref<boolean>(false)

  isUpdating: Ref<boolean> = ref<boolean>(false)
  isUpdated: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, companyBankId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_CHANGE_BANK_SIGNATORY, companyId, emitEvents)

    this.setCompanyBankId(companyBankId)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  setCompanyBankId(companyBankId: string): void {
    this.companyBankId.value = companyBankId
  }

  async fetchApplication(id: string): Promise<void> {
    this.applicationId = id
    this.targetId = id

    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application.value = new CompanyChangeBankSignatory(response)
      this.companyBankId.value = this.application.value.companyBankId
    }
  }

  async setApplication(companyId: string): Promise<void> {
    this.application.value = new CompanyChangeBankSignatory()
    this.application.value.companyId = companyId

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
      this.application.value.companyBankId = this.companyBankId.value
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onDataUpdated(updatedData: any): Promise<void> {
    if (this.isUpdating.value) {
      setTimeout(() => {
        this.onDataUpdated(updatedData)
      }, 1000)

      return
    }

    try {
      this.isUpdating.value = true

      this.application.value = new CompanyChangeBankSignatory(updatedData)
      this.application.value.id = this.applicationId ?? ""
      if (StringUtil.isNullOrEmpty(this.application.value.id)) {
        await this.application.value.create(useCompanyChangeBankSignatoryStore())
      } else {
        await this.application.value.update(useCompanyChangeBankSignatoryStore())
      }

      this.emitEvents("applicationUpdated", this.application.value)

      this.isUpdated.value = true

      setTimeout(() => {
        this.isUpdated.value = false
        this.isUpdating.value = false
      }, 1000)
    } catch {
      //error
      this.isUpdating.value = false
    } finally {
      //
    }
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()
      this.application.value = new CompanyChangeBankSignatory(updatedData)
      this.application.value.id = this.applicationId ?? ""
    }

    try {
      this.emitEvents("back", this.application.value)

      await this.onUpdate()

      let isSignatureSubmitted = false
      if (this.isADirector.value) {
        await this.submitSignature()
        isSignatureSubmitted = true
      }

      // if (isSignatureSubmitted) {
      //   this.onSignatureSuccess()
      // } else {
      //   this.onApplicationUpdated()
      // }

      this.emitEvents("applicationUpdated", this.application.value)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
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
      return "READY FOR DELIVERY"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyChangeBankSignatory>(
      this.companyId,
      this.applicationId,
      this.application.value as CompanyChangeBankSignatory,
      this.isShowWatermark,
      this.watermarkText,
      false,
      false
    )

    props.companyBankId = this.companyBankId.value

    return props
  }

  get updatingLabel(): string {
    if (this.isUpdated.value) {
      return this.language.isMalay() ? "Maklumat Anda telah dikemaskini!" : "Your Information is Saved!"
    }

    return this.language.isMalay() ? "Sedang Mengemaskini Maklumat Anda" : "Saving Your Information"
  }

  get updatingSublabel(): string {
    if (this.isUpdated.value) {
      return ""
    }

    return this.language.isMalay() ? "Sila jangan muat semula!" : "Please do not refresh!"
  }
}
