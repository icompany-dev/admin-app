import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ChangeOfBusinessBranchServiceController extends CompanyServiceController<CompanyAmendmentBranch> {
  companyAmendmentBranch = ref<CompanyAmendmentBranch>(new CompanyAmendmentBranch())
  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAmendmentBranch, useCompanyAmendmentBranchStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_BRANCH
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentBranch.value = new CompanyAmendmentBranch(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.companyAmendmentBranch.value = new CompanyAmendmentBranch(
          this.companyServiceInitializer.existingApplication
        )

        if (StringUtil.isNullOrEmpty(this.companyAmendmentBranch.value.id)) {
          this.hasOngoingApplication.value = false
          this.isInPreviewMode.value = true
        }
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentBranch.value as CompanyAmendmentBranch)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentBranch.value = new CompanyAmendmentBranch()
        this.companyAmendmentBranch.value.companyId = this.companyId
        return
      }

      this.companyAmendmentBranch.value = new CompanyAmendmentBranch(apiRecord.data[0])
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
      let apiRecord = await this.repository.fetchAll(this.lastSubmissionFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        return
      }

      let lastApplication = new CompanyAmendmentBranch(apiRecord.data[0])
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

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAmendmentBranch.value = new CompanyAmendmentBranch(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentBranch.value)
    }
  }

  async onApplicationUpdated(application: CompanyAmendmentBranch): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentBranch.value)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      await this.submitApplication()
      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyAmendmentBranch.value.id
      )
      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentBranch.value.id)) {
      this.companyAmendmentBranch.value.companyId = this.companyId
      this.companyAmendmentBranch.value.name = "Branch Name"
      await this.companyAmendmentBranch.value.create(useCompanyAmendmentBranchStore())
    } else {
      await this.companyAmendmentBranch.value.update(useCompanyAmendmentBranchStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentBranch.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Kemaskini Cawangan Syarikat" : "Update Company Branch"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Perubahan Alamat Cawangan Perniagaan adalah proses mengemas kini lokasi pejabat cawangan
        syarikat. Berdasarkan Akta Syarikat 2016, sesebuah syarikat mesti memberitahu Pendaftar
        tentang sebarang perubahan pada alamat tempat perniagaannya, termasuk cawangan.
        <br><br>
        Syarikat perlu memfailkan notis perubahan alamat tersebut dengan Pendaftar. Ini mesti
        dilakukan dalam tempoh 14 hari dari tarikh perubahan. Notis tersebut mesti menyertakan
        ringkasan alamat baharu. Pendaftar mempunyai kuasa untuk menentukan bentuk dan cara
        maklumat ini perlu difailkan.
        <br><br>
        Kegagalan mematuhi keperluan ini adalah satu kesalahan. Sesebuah syarikat dan pegawainya
        yang gagal memberitahu Pendaftar tentang perubahan alamat dalam tempoh masa yang
        ditetapkan boleh dipertanggungjawabkan. Hukuman jika disabitkan kesalahan adalah
        denda tidak melebihi RM50,000, dan dalam kes kesalahan yang berterusan, denda
        selanjutnya tidak melebihi RM1,000 bagi setiap hari kesalahan itu berterusan selepas sabitan.
      `
    }

    return `
      Change of Business Branch Address is the process of updating the location of a
      company's branch office. Based on the Companies Act 2016, a company must notify the
      Registrar of any change to the address of its places of business, including branches.
      <br><br>
      The company must lodge a notice of the change of address with the Registrar. This must
      be done within 14 days of the change. The notice must include a summary of the new
      address. The Registrar has the authority to determine the form and manner in which
      this information is lodged.
      <br><br>
      Failing to comply with this requirement is an offense. A company and its officers who
      fail to notify the Registrar of the change in address within the specified time frame
      can be held liable. The penalty upon conviction is a fine not exceeding RM50,000,
      and in the case of a continuing offense, a further fine not exceeding RM1,000 for each
      day the offense continues after conviction.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Alamat Cawangan Syarikat" : "Resolution: Business Branch Address"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Alamat Cawangan Perniagaan" : "Learn More: Business Branch Address"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        Perubahan Alamat Cawangan Perniagaan adalah proses mengemas kini lokasi pejabat cawangan
        syarikat. Berdasarkan Akta Syarikat 2016, sesebuah syarikat mesti memberitahu Pendaftar
        tentang sebarang perubahan pada alamat tempat perniagaannya, termasuk cawangan.
        <br><br>
        Syarikat perlu memfailkan notis perubahan alamat tersebut dengan Pendaftar. Ini mesti
        dilakukan dalam tempoh 14 hari dari tarikh perubahan. Notis tersebut mesti menyertakan
        ringkasan alamat baharu. Pendaftar mempunyai kuasa untuk menentukan bentuk dan cara
        maklumat ini perlu difailkan.
        <br><br>
        Kegagalan mematuhi keperluan ini adalah satu kesalahan. Sesebuah syarikat dan pegawainya
        yang gagal memberitahu Pendaftar tentang perubahan alamat dalam tempoh masa yang
        ditetapkan boleh dipertanggungjawabkan. Hukuman jika disabitkan kesalahan adalah
        denda tidak melebihi RM50,000, dan dalam kes kesalahan yang berterusan, denda
        selanjutnya tidak melebihi RM1,000 bagi setiap hari kesalahan itu berterusan selepas sabitan.
      `
    }

    return `
      Change of Business Branch Address is the process of updating the location of a
      company's branch office. Based on the Companies Act 2016, a company must notify the
      Registrar of any change to the address of its places of business, including branches.
      <br><br>
      The company must lodge a notice of the change of address with the Registrar. This must
      be done within 14 days of the change. The notice must include a summary of the new
      address. The Registrar has the authority to determine the form and manner in which
      this information is lodged.
      <br><br>
      Failing to comply with this requirement is an offense. A company and its officers who
      fail to notify the Registrar of the change in address within the specified time frame
      can be held liable. The penalty upon conviction is a fine not exceeding RM50,000,
      and in the case of a continuing offense, a further fine not exceeding RM1,000 for each
      day the offense continues after conviction.
    `
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  // PASCA functions
  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.haveAllSigned()) {
      let sorted = ObjectUtil.sort<SignatureGroup>(this.application.value.signatureGroups, "createdAt", "desc")

      return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  hasAtLeastOneSignature(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value && this.application.value.signatureGroups.length > 0
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.hasAtLeastOneSignature()
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Akan diserah simpan kepada SSM" : "To be lodged with SSM"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAmendmentBranch() : this.companyAmendmentBranch.value
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
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.haveAllSigned(),
      this.hasSigned(),
      this.signatureDate(),
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
      CompanyAmendmentBranch,
      useCompanyAmendmentBranchStore(),
      false,
      false
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentBranch>(
      this.companyId,
      this.companyAmendmentBranch.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
