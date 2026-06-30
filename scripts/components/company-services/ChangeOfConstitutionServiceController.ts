import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class ChangeOfConstitutionServiceController extends CompanyServiceController<CompanyAmendmentConstitution> {
  companyAmendmentConstitution = ref<CompanyAmendmentConstitution>(new CompanyAmendmentConstitution())

  applicationType = ref<string>(ConstitutionAmendmentTypes.Adopt)

  wrapperRef: any | null = null

  constructor(companyId: string, type: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, true, CompanyAmendmentConstitution, useCompanyAmendmentConstitutionStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_CONSTITUTION
    this.applicationType.value = type
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(
          this.companyServiceInitializer.newApplication
        )
        this.companyAmendmentConstitution.value.type = this.applicationType.value
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(
          this.companyServiceInitializer.existingApplication
        )
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentConstitution.value as CompanyAmendmentConstitution)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution()
        this.companyAmendmentConstitution.value.companyId = this.companyId
        this.companyAmendmentConstitution.value.type = this.applicationType.value
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyAmendmentConstitution.value = new CompanyAmendmentConstitution(apiRecord.data[0])
      this.hasOngoingApplication.value = true
      this.viewType.value = ViewMode.Existing
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

      let lastApplication = new CompanyAmendmentConstitution(apiRecord.data[0])
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

  async onProceedClicked(): Promise<void> {
    if (!this.hasPaid()) {
      // Create application if it doesn't exist yet
      if (StringUtil.isNullOrEmpty(this.companyAmendmentConstitution.value.id)) {
        await this.companyAmendmentConstitution.value.create(this.repository)
      }
      this.emitEvents("pay")
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  isShowAdoptResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Adopt
  }

  isShowAmendResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Amend
  }

  isShowAbolishResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Abolish
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let typeOfChange = this.language.isMalay() ? "Menerima Pakai" : "Adopt"
    if (this.applicationType.value === ConstitutionAmendmentTypes.Amend) {
      typeOfChange = this.language.isMalay() ? "Menukar" : "Change"
    } else if (this.applicationType.value === ConstitutionAmendmentTypes.Abolish) {
      typeOfChange = this.language.isMalay() ? "Memansuhkan" : "Abolish"
    }

    let label = this.language.isMalay() ? `${typeOfChange} Perlembagaan` : `${typeOfChange} Constitution`
  }

  slipCaseTitle(): string {
    let typeOfChange = this.language.isMalay() ? "Menerima Pakai" : "Adopt"
    if (this.applicationType.value === ConstitutionAmendmentTypes.Amend) {
      typeOfChange = this.language.isMalay() ? "Menukar" : "Change"
    } else if (this.applicationType.value === ConstitutionAmendmentTypes.Abolish) {
      typeOfChange = this.language.isMalay() ? "Memansuhkan" : "Abolish"
    }

    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk ${typeOfChange} Perlembagaan Perniagaan`
      : `DCR & MCR to ${typeOfChange} Constitution`
  }

  helpTitle(): string {
    let typeOfChange = this.language.isMalay() ? "Menerima Pakai" : "Adopt"
    if (this.applicationType.value === ConstitutionAmendmentTypes.Amend) {
      typeOfChange = this.language.isMalay() ? "Menukar" : "Change"
    } else if (this.applicationType.value === ConstitutionAmendmentTypes.Abolish) {
      typeOfChange = this.language.isMalay() ? "Memansuhkan" : "Abolish"
    }

    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk ${typeOfChange} Perlembagaan Perniagaan`
      : `DCR & MCR to ${typeOfChange} Constitution`
  }

  helpDescription(): string {
    if (this.applicationType.value === ConstitutionAmendmentTypes.Adopt) {
      return this.language.isMalay()
        ? `
            Proses ini bermula dengan Resolusi Edaran Pengarah (DCR). Daripada perlu berkumpul untuk mesyuarat lembaga, para 
            pengarah akan mengedarkan dokumen bertulis sesama mereka untuk mengusulkan Perlembagaan baharu secara rasmi. Dengan 
            menandatangani dokumen ini, para pengarah secara rasmi meluluskan draf "buku peraturan" tersebut dan memberi kuasa 
            untuk mengedarkannya kepada pemegang saham bagi undian akhir. Langkah ini memastikan kepimpinan syarikat adalah 
            selari sebelum membentangkan perubahan tersebut kepada pemilik syarikat.
            <br><br>
            Keputusan akhir terletak di tangan pemegang saham, yang dilaksanakan melalui Resolusi Edaran Ahli (MCR). Memandangkan 
            penerimaan pakai Perlembagaan memerlukan Resolusi Khas, kebiasaannya sekurang-kurangnya 75% daripada ahli yang layak 
            mengundi mesti menandatangani dokumen ini untuk meluluskannya. Ini membolehkan syarikat persendirian menerima pakai 
            Perlembagaan baharu secara sah semata-mata melalui dokumentasi, tanpa kerumitan atau kos untuk mengadakan Mesyuarat 
            Agung yang formal.
          `
        : `
            The process begins with the Directors' Circular Resolution (DCR). Instead of gathering for a boardroom meeting, 
            the directors circulate a written document among themselves to formally propose the new Constitution. By signing 
            this document, the directors officially approve the draft "rulebook" and authorise its circulation to the shareholders for 
            the final vote. This step ensures the company's leadership is aligned before presenting the change to the owners.
            <br><br>
            The final decision lies with the shareholders, executed through a Members' Circular Resolution (MCR). Since adopting 
            a Constitution requires a Special Resolution, usually at least 75% of the eligible voting members must sign 
            this document to pass it. This allows private companies to legally adopt the new Constitution purely through paperwork, 
            without the hassle or expense of convening a formal General Meeting.
          `
    }

    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Semua Pengarah <b>mesti menandatangani</b> untuk pengesahan (<i>boleh dilakukan secara elektronik di sini</i>).</li>
          <li>Pilih: <b>Express Filing</b> atau <b>Normal Filing</b> (harga berbeza mengikut SSM).</li>
          <li>Setelah pendaftaran diluluskan oleh SSM, Sistem iCompany akan memberitahu semua Pengarah.</li>
          <li>Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).</li>
        </ul>
        `
      : `This DCR requires:
          <ul>
            <li>All Directors <b>must sign</b> for confirmation (<i>can be done electronically here</i>).</li>
            <li>Choose: <b>Express Filing</b> or <b>Normal Filing</b> (price varies based on SSM Fees).</li>
            <li>Once filing is approved by SSM, iCompany System will notify all Directors.</li>
            <li>Purchase & Download SSM Corporate Profile as confirmation of the change (optional).</li>
          </ul>
        `
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New
        ? new CompanyAmendmentConstitution()
        : this.companyAmendmentConstitution.value
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
      CompanyAmendmentConstitution,
      useCompanyAmendmentConstitutionStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentConstitution>(
      this.companyId,
      this.companyAmendmentConstitution.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
