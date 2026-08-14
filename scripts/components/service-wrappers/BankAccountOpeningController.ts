import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyBankAccountOpeningStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { BankConstants } from "~/scripts/constants/Banks"
import { AllianceBankApplicationDetails } from "~/scripts/types/banks/AllianceBankApplicationDetails"
import { StatusConstants } from "~/scripts/constants/Status"
import { AffinBankApplicationDetails } from "~/scripts/types/banks/AffinBankApplicationDetails"

export class BankAccountOpeningController
  extends ServiceController
  implements IServiceController<CompanyBankAccountOpening, ReturnType<typeof useCompanyBankAccountOpeningStore>>
{
  application: CompanyBankAccountOpening = new CompanyBankAccountOpening()
  applicationRef = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())
  bankId: Ref<string> = ref<string>("")
  applicationId: string | null = null
  repository = useCompanyBankAccountOpeningStore()
  companyRepository = useCompanyStore()

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  autoSaveAlertRef: any | null = null

  isShowing: Ref<boolean> = ref<boolean>(false)
  isAlertShown: Ref<boolean> = ref<boolean>(false)

  isUpdating: Ref<boolean> = ref<boolean>(false)
  isUpdated: Ref<boolean> = ref<boolean>(false)
  isUpdatingPending: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_OPEN_BANK_ACCOUNT, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(companyId)
    }
  }

  setAutoSaveAlertRef(autoSaveAlertRef: any): void {
    this.autoSaveAlertRef = autoSaveAlertRef

    if (!this.isAlertShown.value && this.isShowing.value) {
      nextTick(() => {
        this.autoSaveAlertRef.show()
        this.isAlertShown.value = true
      })
    }
  }

  async fetchApplication(id: string): Promise<void> {
    await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyBankAccountOpening(this.repository.companyBankAccountOpening)
      this.applicationRef.value = new CompanyBankAccountOpening(this.repository.companyBankAccountOpening)
      this.applicationId = this.application.id
      this.targetId = this.application.id
      this.bankId.value = this.application.bankId
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyBankAccountOpening()
      this.application.companyId = companyId
      this.application.company = new Company(this.companyRepository.company)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  setIsShowing(isShowing: boolean): void {
    this.isShowing.value = isShowing

    if (this.isShowing.value && this.autoSaveAlertRef && !this.isAlertShown.value) {
      this.autoSaveAlertRef.show()
      this.isAlertShown.value = true
    }
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanyBankAccountOpening(updatedData)
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
    await this.applicationRef.value.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: Implement removal with confirmation
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Pembukaan Akaun Bank" : "Bank Account Opening"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        <b>Pembukaan Akaun Bank</b> memerlukan resolusi pengarah untuk memberi kuasa kepada syarikat membuka dan
        mengekalkan akaun deposit dengan bank yang dipilih.
        <br><br>
        Resolusi ini termasuk butiran bank, penandatangan akaun korporat, dan orang yang diberi kuasa untuk perbankan dalam talian.
        <br><br>
        Resolusi perlu ditandatangani oleh semua pengarah secara <b>tandatangan basah (wet ink)</b>.
      `
    }

    return `
      <b>Bank Account Opening</b> requires a director's resolution to authorise the company to open and
      maintain a deposit account with the selected bank.
      <br><br>
      The resolution includes bank details, corporate account signatories, and authorised persons for online banking.
      <br><br>
      The resolution is required to be <b>signed in wet ink</b> by all directors.
    `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  async onDataUpdated(): Promise<void> {
    if (!this.dcrRef) {
      return
    }

    if (this.isUpdating.value) {
      setTimeout(() => {
        this.onDataUpdated()
      }, 500)
      return
    }

    this.isUpdating.value = true

    try {
      let branchId = this.dcrRef.getBranchId()
      let signatories = this.dcrRef.getSignatories()
      let signatoryType = this.dcrRef.getSignatoryType()
      let authorisedPersons = this.dcrRef.getAuthorisedPersonsForOnlineBanking()

      this.applicationRef.value.bankBranchId = branchId
      this.applicationRef.value.signatories = signatories
      this.applicationRef.value.signatoryType = signatoryType
      this.applicationRef.value.onlineBanking = authorisedPersons

      if (this.applicationRef.value.bankId === BankConstants.ALLIANCE_BANK_DETAIL.id) {
        let allianceBankApplicationDetails = this.dcrRef.getOtherDetails()
        this.applicationRef.value.allianceBankApplicationDetails = allianceBankApplicationDetails
          ? new AllianceBankApplicationDetails(allianceBankApplicationDetails)
          : null
      }

      if (this.applicationRef.value.bankId === BankConstants.AFFIN_BANK_DETAIL.id) {
        let affinBankApplicationDetails = this.dcrRef.getOtherDetails()
        this.applicationRef.value.affinBankApplicationDetails = affinBankApplicationDetails
          ? new AffinBankApplicationDetails(affinBankApplicationDetails)
          : null
      }

      await this.onUpdate()

      this.isUpdated.value = true

      setTimeout(() => {
        this.isUpdated.value = false
        this.isUpdating.value = false
      }, 1000)
      this.emitEvents("applicationUpdated", this.applicationRef.value)
    } catch (e) {
      console.log(e, "error")
      this.isUpdating.value = false
    } finally {
      // this.isUpdating.value = false
    }
  }

  get showWatermark(): boolean {
    if (this.applicationRef.value.status === StatusConstants.READY) {
      return true
    }

    return this.applicationRef.value.signatureGroups.length <= 0
  }

  get watermarkText(): string {
    if (this.applicationRef.value.status === StatusConstants.READY) {
      return "READY FOR DELIVERY"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyBankAccountOpening>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyBankAccountOpening,
      this.showWatermark,
      this.watermarkText,
      false,
      false,
      null,
      this.bankId.value
    )

    props.isShowTag = this.applicationRef.value.status === StatusConstants.PAID

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
