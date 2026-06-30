import { CompanyPreferenceShareRight } from "~/scripts/models/CompanyPreferenceShareRight"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"

export class PreferenceShareRightServiceController extends CompanyServiceController<CompanyPreferenceShareRight> {
  companyPreferenceShareRight = ref<CompanyPreferenceShareRight>(new CompanyPreferenceShareRight())

  wrapperRef: any | null = null

  constructor(companyId: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyPreferenceShareRight, useCompanyPreferenceShareRightStore(), emitEvents)
    this.target = CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    await this.fetchOngoingApplication()
    await this.fetchPreviousSubmission()

    this.init(this.companyPreferenceShareRight.value as CompanyPreferenceShareRight)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let response = await this.repository.ongoing(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.companyPreferenceShareRight.value = new CompanyPreferenceShareRight()
        this.companyPreferenceShareRight.value.companyId = this.companyId
        return
      }

      this.companyPreferenceShareRight.value = new CompanyPreferenceShareRight(response)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
        errorMessage.handle()
      }
    }
  }

  async fetchPreviousSubmission(): Promise<void> {
    try {
      let response = await this.repository.latestCompleted(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        return
      }

      let lastApplication = new CompanyPreferenceShareRight(response)
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchLatest()
        errorMessage.handle()
      }
    }
  }

  async onProceedClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.companyPreferenceShareRight.value.id) && !this.hasPaid()) {
      this.emitEvents("pay")
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  onWrapperMinimized(applicationData: any): void {
    this.companyPreferenceShareRight.value = new CompanyPreferenceShareRight(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyPreferenceShareRight.value)
    }
  }

  override async setTotalPages(): Promise<void> {
    await nextTick()

    let totalMcrPages: number = 1

    if (this.mcrRef) {
      totalMcrPages = this.mcrRef.totalPages() //NOTE: this mcr has no accompanying document
    }

    this.totalPages.value = totalMcrPages
  }

  //copywriting

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let label = this.language.isMalay() ? "Peniaan Hak-Hak Kelas" : "Variations of Class Rights"
    this.wrapperRef.addOptionButtonRef("preference-share-right", label, () => {})
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Peniaan Hak-Hak Kelas" : "Variations of Class Rights"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Di bawah Seksyen 90 Akta Syarikat 2016, undang-undang bertindak sebagai penentu ketat bagi klasifikasi saham Sdn Bhd 
        anda. Ia menetapkan bahawa anda tidak boleh menerbitkan Syer Keutamaan (Preference Shares) melainkan <b>Perlembagaan 
        Syarikat anda menyenaraikan dengan jelas hak-hak yang dimiliki oleh pemegang saham ini</b>. Secara khusus, Perlembagaan 
        Sdn Bhd anda mesti menyatakan dengan nyata kelayakan mereka terhadap:
        <ul>
          <li>Bayaran balik modal;</li>
          <li>Penyertaan dalam aset lebihan;</li>
          <li>Pembayaran dividen (sama ada kumulatif atau bukan kumulatif); dan</li>
          <li>Hak mengundi.</li>
        </ul>
        Memandangkan Seksyen 90 mengunci hak-hak ini di dalam Perlembagaan demi melindungi pemegang saham, sebarang percubaan 
        untuk mengubahnya memerlukan anda meminda Perlembagaan secara rasmi.
      `
    }

    return `
      Under Section 90 of Companies Act 2016, the law acts as a strict "label maker" for your Sdn Bhd's shares. It 
      mandates that you cannot issue Preference Shares unless your <b>Company's Constitution clearly lists exactly 
      what rights these shareholders possess</b>. Specifically, the Constitution must explicitly state their entitlement 
      to: 
      <ul>
        <li>repayment of capital,</li>
        <li>participation in surplus assets,</li>
        <li>dividend payments (whether cumulative or non-cumulative), and</li>
        <li>voting rights</li>
      </ul>
      Since Section 90 locks these rights into the Constitution to protect the shareholders, any attempt to change them 
      requires you to formally amend the Constitution.
    `
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyPreferenceShareRight.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    let items = []
    if (this.language.isMalay()) {
      items = [
        "Resolusi: Cadangan Peniaan Hak-Hak Kelas - Syer Keutamaan.",
        "Resolusi: Peniaan Hak-Hak Kelas - Syer Keutamaan.",
      ]
    }

    items = [
      "Resolution: Propose Variation of Class Rights - Preference Shares",
      "Resolution: Variation of Class Rights - Preference Shares",
    ]

    let list = `
      <ul>
        <li>${items.join("</li><li>")}</li>
      </ul>
    `

    return list
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  override payLabel(): string {
    return this.language.isMalay() ? "dari RM599" : "from RM599"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyPreferenceShareRight() : this.companyPreferenceShareRight.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      application,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      application.id,
      this.currentPage.value,
      this.totalPages.value,
      "MCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyPreferenceShareRight,
      useCompanyPreferenceShareRightStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyPreferenceShareRight>(
      this.companyId,
      this.companyPreferenceShareRight.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
