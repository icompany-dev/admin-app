import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"
import { ResolutionController } from "./ResolutionController"
import { useCompanyPostShareTransferStore } from "~/stores/CompanyPostShareTransfers"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Error } from "~/scripts/library/Error"
import { SelectOption } from "~/scripts/types/SelectOption"
import { RegisterOfTransferType } from "~/scripts/constants/Shareholder"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrRegisterTransferOfSharesController extends ResolutionController<CompanyPostShareTransfer> {
  companyPostShareTransferRepository = useCompanyPostShareTransferStore()
  companyRepository = useCompanyStore()

  shareholders = ref<Shareholder[]>([])

  transferDetails = ref<CompanyShareTransferDetail[]>([])
  transfereeNames = ref<SelectOption[]>([])
  shareTransferApplication = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())

  time = useLocalTime()

  selectedRegisterType = ref<string>(RegisterOfTransferType.Approval)
  registerTypeOptions: SelectOption[] = [
    new SelectOption(
      RegisterOfTransferType.Approval,
      RegisterOfTransferType.Approval,
      "Approval for Registration of Shares"
    ),
    new SelectOption(RegisterOfTransferType.Delay, RegisterOfTransferType.Delay, "Delay for Registration of Shares"),
    new SelectOption(
      RegisterOfTransferType.Refusal,
      RegisterOfTransferType.Refusal,
      "Refusal for Registration of Shares"
    ),
  ]

  constructor(props: IPropsResolutionDocument<CompanyPostShareTransfer>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyPostShareTransfer,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    try {
      let response = await this.companyPostShareTransferRepository.fetch(id)
      if (!this.companyPostShareTransferRepository.error) {
        this.application.value = new CompanyPostShareTransfer(response)

        this.shareTransferApplication.value = new CompanyShareholderTransfer(this.application.value.shareTransfer)
        if (StringUtil.isNullOrEmpty(this.application.value.shareTransfer.id)) {
          let transferRepository = useCompanyShareholderTransferStore()
          let transferResponse = await transferRepository.fetch(this.application.value.transferId)
          if (transferResponse) {
            this.shareTransferApplication.value = new CompanyShareholderTransfer(transferResponse)
          }
        }
        this.setTransferDetails()
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyPostShareTransfer()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.shareTransferApplication.value = new CompanyShareholderTransfer()
      this.setTransferDetails()
    }
  }

  override async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.fetchShareholders()
  }

  setTransferDetails(): void {
    this.transferDetails.value = this.shareTransferApplication.value.transferDetails.map((d: any) => {
      return new CompanyShareTransferDetail(d)
    })

    if (this.transferDetails.value.length <= 0) {
      this.transferDetails.value.push(new CompanyShareTransferDetail())
    }

    this.transfereeNames.value = this.transferDetails.value.map((d: CompanyShareTransferDetail) => {
      return new SelectOption(d.id, d.id, d.transferToName?.toUpperCase() ?? "Unknown Transferee")
    })

    this.setMaxSignatureOnFirstPage()
  }

  async fetchShareholders(): Promise<void> {
    this.shareholders.value = []

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      this.shareholders.value = response.map((s: Shareholder) => {
        return new Shareholder(s)
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    await this.fetchShareholders()
  }

  setContent(): void {
    // do nothing
  }

  onApplicationChanged(application: CompanyPostShareTransfer): void {
    this.application.value = new CompanyPostShareTransfer(application)
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  setMaxSignatureOnFirstPage(): void {
    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2

    let limit = this.isDocumentEditable() ? 4 : 6

    if (this.transferDetails.value.length >= limit) {
      this.signatureStartOnPage.value = 2
      this.maxSignatureOnFirstPage.value = 6
    }
  }

  getApplicationData(): CompanyPostShareTransfer {
    if (!this.application.value) {
      this.application.value = new CompanyPostShareTransfer()
    }

    this.application.value.delayType = this.selectedRegisterType.value

    return this.application.value as CompanyPostShareTransfer
  }

  onRegisterTypeClicked(selectedRegisterType: string): void {
    if (this.selectedRegisterType.value === selectedRegisterType) {
      this.selectedRegisterType.value = RegisterOfTransferType.Approval // fall to default, value cannot be null
      return
    }

    this.selectedRegisterType.value = selectedRegisterType
  }

  isRegisterTypeSelected(selectedRegisterType: string): boolean {
    return this.selectedRegisterType.value === selectedRegisterType
  }

  isApproval(): boolean {
    return this.selectedRegisterType.value === RegisterOfTransferType.Approval
  }

  isDelay(): boolean {
    return this.selectedRegisterType.value === RegisterOfTransferType.Delay
  }

  isRefusal(): boolean {
    return this.selectedRegisterType.value === RegisterOfTransferType.Refusal
  }

  registerType(): string {
    if (!this.application.value) {
      return "Approval for Registration of Shares"
    }

    let type = StringUtil.capitalize(this.application.value.delayType)

    return `${type} for Registration of Shares`
  }

  has30DaysExpired(section105Date: string): boolean {
    return this.dayjs(section105Date).add(30, "day").isBefore(this.dayjs())
  }

  section105Date(transferDetail: CompanyShareTransferDetail): string {
    return this.time.formatDateOnlyShort(this.dayjs().format("YYYY-MM-DD"))
  }
}
