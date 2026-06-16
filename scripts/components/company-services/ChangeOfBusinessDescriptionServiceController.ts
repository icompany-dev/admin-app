import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ChangeOfBusinessDescriptionServiceController extends CompanyServiceController<CompanyAmendmentDescription> {
  companyAmendmentDescription = ref<CompanyAmendmentDescription>(new CompanyAmendmentDescription())
  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAmendmentDescription, useCompanyAmendmentDescriptionStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_DESCRIPTION
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentDescription.value = new CompanyAmendmentDescription(
          this.companyServiceInitializer.newApplication
        )
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentDescription.value as CompanyAmendmentDescription)
    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentDescription.value = new CompanyAmendmentDescription()
        this.companyAmendmentDescription.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAmendmentDescription.value = new CompanyAmendmentDescription(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
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
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyAmendmentDescription(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
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

    this.companyAmendmentDescription.value = new CompanyAmendmentDescription(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentDescription.value)
    }
  }

  async onApplicationUpdated(application: CompanyAmendmentDescription): Promise<void> {
    if (!application) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentDescription.value)
    }
  }

  setApplicationData(applicationData: CompanyAmendmentDescription): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
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
        this.companyAmendmentDescription.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyAmendmentDescription.value.id)) {
      this.companyAmendmentDescription.value.companyId = this.companyId
      this.companyAmendmentDescription.value.businessDescription = "-"
      await this.companyAmendmentDescription.value.create(useCompanyAmendmentDescriptionStore())
    } else {
      await this.companyAmendmentDescription.value.update(useCompanyAmendmentDescriptionStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentDescription.value.id) || !this.hasPaid()) {
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
    return this.language.isMalay() ? "Update Business Nature" : "Update Business Nature"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `Lorem
        <br><br>
        Lorem`
    }

    return `Lorem
      <br><br>
      Lorem`
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Perihal Perniagaan" : "Resolution: Business Nature"
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Penambahan / Perubahan / Pengemaskinian Perihal Perniagaan"
      : "Learn More: Add /Change / Update Business Nature"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Sesebuah syarikat boleh mengemas kini Sifat Perniagaannya apabila perihalan sedia ada tidak lagi 
          mencerminkan aktiviti sebenar atau aktiviti yang dirancang oleh syarikat tersebut.
        </p>
        <p>
          Sifat Perniagaan merujuk kepada perihalan aktiviti perniagaan yang dinyatakan semasa pemerbadanan. 
          Di bawah Seksyen 14(3)(c) Akta Syarikat 2016, permohonan pemerbadanan mestilah menyertakan sifat 
          perniagaan bagi syarikat yang dicadangkan. Perihalan ini adalah penting kerana ia dipaparkan dalam 
          Profil Korporat SSM dan sering digunakan untuk klasifikasi MSIC, urusan perbankan, percukaian, pelesenan, 
          audit, serta semakan pematuhan am.
        </p>
        <p>
          Sesebuah syarikat mempunyai kapasiti penuh untuk menjalankan atau melaksanakan mana-mana perniagaan atau 
          aktiviti seperti yang diperuntukkan di bawah Seksyen 21 Akta Syarikat 2016. Walau bagaimanapun, Sifat 
          Perniagaan yang direkodkan dengan SSM hendaklah sentiasa tepat dan konsisten dengan aktiviti sebenar syarikat. 
          Ini merupakan amalan tadbir urus yang baik dan sangat disyorkan.
        </p>
        <p>
          Permohonan ini memerlukan serahan melalui <b>Borang PD2</b>, di mana anda boleh memilih sama ada <b>Serahan 
          Biasa (<i>Normal Filing</i>)</b> atau <b>Serahan Ekspres (<i>Express Filing</i>)</b>, tertakluk kepada fi 
          yang berbeza yang perlu dibayar kepada SSM.
        </p>
        <p>
          Pengemaskinian Sifat Perniagaan tidak menjejaskan identiti sah, hak, kewajipan, kontrak, liabiliti, atau 
          nombor pendaftaran syarikat. Anda diingatkan bahawa aktiviti perniagaan tertentu mungkin memerlukan lesen 
          tambahan, kelulusan, permit, atau pelepasan kawal selia sebelum ia boleh dijalankan secara sah.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 14(3)(c) dan 21 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        A company may update its Business Nature where the current description no longer reflects the actual or 
        intended activities of the company.
      </p>
      <p>
        The Business Nature refers to the description of the business activity stated during incorporation. Under 
        Section 14(3)(c) of the Companies Act 2016, the application for incorporation must include the nature of 
        business of the proposed company. This description is important and it is reflected in the SSM Corporate 
        Profile and it is also often used for MSIC classification, banking, tax, licensing, audit, and general 
        compliance review.
      </p>
      <p>
        A company has full capacity to carry on or undertake any business or activity as prescribed under Section 21 
        of the Companies Act 2016. However, the Business Nature recorded with SSM should still be kept accurate and 
        consistent with what the company actually does. It is just a good governance and a recommended practice.
      </p>
      <p>
        This Application requires lodgement via <b>Form PD2</b>, where you may select either <b>Normal Filing</b> or 
        <b>Express Filing</b>, subject to different fees payable to SSM.
      </p>
      <p>
        Updating the Business Nature does not affect the company’s legal identity, rights, obligations, contracts, 
        liabilities, or registration number. You are reminded that certain business activities may require additional 
        licences, approvals, permits, or regulatory clearance before they can be lawfully carried out.
      </p>
      <p>
        <b>Reference:</b> Sections 14(3)(c) and 21 of the Companies Act 2016.
      </p>
    `
  }

  // PASCA functions
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length

    let percentage = Math.ceil((totalSigned / this.totalNumberOfDirectors.value) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let shareholderSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return sg.group?.target === "director"
      })

      if (shareholderSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(shareholderSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Akan diserah simpan kepada SSM" : "To be lodged with SSM"
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAmendmentDescription.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAmendmentDescription.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isMajorityReached(),
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
      CompanyAmendmentDescription,
      useCompanyAmendmentDescriptionStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentDescription>(
      this.companyId,
      this.companyAmendmentDescription.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
