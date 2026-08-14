import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class LoanToDirectorServiceController extends CompanyServiceController<CompanyDirectorLoan> {
  companyDirectorLoan = ref<CompanyDirectorLoan>(new CompanyDirectorLoan())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, true, CompanyDirectorLoan, useCompanyDirectorLoanStore(), emitEvents)

    this.target = CompanyConstants.TARGET_DIRECTOR_LOAN
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyDirectorLoan.value = new CompanyDirectorLoan(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.setViewType(ViewMode.Existing)
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
        this.companyDirectorLoan.value = new CompanyDirectorLoan(this.companyServiceInitializer.existingApplication)
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyDirectorLoan.value as CompanyDirectorLoan)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyDirectorLoan.value = new CompanyDirectorLoan()
        this.companyDirectorLoan.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyDirectorLoan.value = new CompanyDirectorLoan(apiRecord.data[0])
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

      let lastApplication = new CompanyDirectorLoan(apiRecord.data[0])
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

  isPreview(): boolean {
    return this.isInPreviewMode.value
  }

  async onApplicationUpdated(application: CompanyDirectorLoan): Promise<void> {
    if (this.viewType.value === ViewMode.New) {
      return
    }

    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyDirectorLoan.value)
    }
  }

  setApplicationData(applicationData: CompanyDirectorLoan): void {
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
        this.companyDirectorLoan.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyDirectorLoan.value.id)) {
      this.companyDirectorLoan.value.companyId = this.companyId
      await this.companyDirectorLoan.value.create(useCompanyDirectorLoanStore())
    } else {
      await this.companyDirectorLoan.value.update(useCompanyDirectorLoanStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyDirectorLoan.value.id) || !this.hasPaid()) {
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
    return this.language.isMalay() ? "Lantik Pengarah Baharu" : "Appoint New Director"
  }

  helpDescription(): string {
    //TODO: Get the copywriting for this
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat perniagaan atau cawangan, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        Perkara ini dilakukan melalui borang khusus untuk "Pemberitahuan Pertukaran
        Alamat Perniagaan/Cawangan dan/atau Jenis Perniagaan".
        <br><br>
        Pemberitahuan pertukaran alamat perniagaan hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM 2/2017. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its business or branch address, it must notify
      SSM of the change within fourteen days from the effective date of the change.
      This is done through a specific form for "Notification of Change in the
      Business/Branch Address and/or Nature of Business".
      <br><br>
      The notification of change in business address is to be done in the form
      and manner specified by SSM's Practice Directive 2/2017. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Pinjaman kepada Pengarah" : "Resolution: Loan to Director"
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Maklumat Lanjut: Pinjaman kepada Pengarah" : "Learn More: Loan to Director"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          Sesebuah syarikat hanya boleh memberikan <span class='glossary' id='financial-assistance'>pinjaman, 
          jaminan, atau bantuan kewangan</span> kepada seseorang Pengarah selaras dengan Akta Syarikat 2016. 
          Di bawah Seksyen 224 Akta Syarikat 2016, sesebuah syarikat secara amnya dilarang daripada memberikan 
          pinjaman kepada Pengarahnya atau kepada orang yang mempunyai hubungan dengan Pengarahnya, sama ada 
          secara langsung atau tidak langsung.
        </p>
        <p>
          Walau bagaimanapun, sekatan ini tertakluk kepada pengecualian terhad, termasuk:
        </p>
        <ul>
          <li>
            Pinjaman bagi membolehkan seseorang Pengarah membayar perbelanjaan yang dilakukan untuk 
            manfaat syarikat;
          </li>
          <li>
            Pinjaman kepada Pengarah sepenuh masa di bawah skim pekerja yang diluluskan;
          </li>
          <li>
            Pinjaman yang dibuat dalam perjalanan biasa perniagaan oleh sesebuah syarikat yang aktiviti 
            perniagaan utamanya termasuk aktiviti memberi pinjaman.
          </li>
        </ul>
        <p>
          Sebarang transaksi sedemikian mestilah diberikuasa, didokumentasikan, dan direkodkan dengan sewajarnya. 
          Dalam kebanyakan kes, kelulusan awal oleh pemegang saham adalah diperlukan sebelum syarikat boleh 
          meneruskannya, walaupun syarikat tersebut hanya terdiri daripada seorang Pengarah dan seorang Pemegang 
          Saham yang dipegang oleh individu yang sama.
        </p>
        <p>
          Aplikasi ini memudahkan penyediaan Resolusi dan dokumentasi yang diperlukan untuk menyelaraskan 
          atau meluluskan bantuan kewangan tersebut. Walaupun dana tersebut mungkin berasal daripada perniagaan 
          yang anda kendalikan, Sdn Bhd adalah sebuah <b>entiti undang-undang yang berasingan</b>, dan sebarang pengeluaran 
          mestilah mengikut proses dan tadbir urus yang betul kerana Juruaudit anda akan menelitinya sewajarnya. 
          Ia bukan sekadar perkara mengambil dana daripada syarikat secara mudah.
        </p>
        <p>
          Anda diingatkan bahawa ketidakpatuhan boleh menyebabkan transaksi tersebut menjadi tidak sah dan 
          boleh mendedahkan para Pengarah kepada liabiliti peribadi serta tindakan penguatkuasaan.
        </p>
        <p>
          <b>Rujukan:</b> Seksyen 224 Akta Syarikat 2016.
        </p>
      `
    }

    return `
      <p>
        A company may provide a <span class='glossary' id='financial-assistance'>loan, guarantee, or financial assistance</span> 
        to a Director only in accordance with the Companies Act 2016. Under Section 224 of the Companies Act 2016, a 
        company is generally prohibited from giving loans to its Directors or to persons connected to its Directors, 
        whether directly or indirectly.
      </p>
      <p>
        However, this restriction is subject to limited exceptions, including:
      </p>
      <ul>
        <li>
          Loans to enable a Director to meet expenditure incurred for the benefit of the company;
        </li>
        <li>
          Loans to full-time Directors under an approved employee scheme;
        </li>
        <li>
          Loans made in the ordinary course of business by a company whose primary business includes lending activities.
        </li>
      </ul>
      <p>
        Any such transaction must be properly authorised, documented, and recorded. In most cases, prior approval by the 
        shareholders is required before the company can proceed, even where the company consists of a single Director and a 
        single Shareholder held by the same person.
      </p>
      <p>
        This Application facilitates the preparation of the necessary Resolution and documentation to regularise or approve 
        such financial assistance. While the funds may originate from the business you operate, the Sdn Bhd is a 
        <b>separate legal entity</b>, and any withdrawal must follow proper process and governance, as your Auditor will 
        scrutinise accordingly. It is not simply a matter of taking funds from the company.
      </p>
      <p>
        You are reminded that non-compliance may result in the transaction being invalid and may expose the Directors to personal liability and regulatory action.
      </p>
      <p>
        <b>Reference:</b> Section 224 of the Companies Act 2016
      </p>
    `
  }

  get serviceWrapperProps() {
    let application = this.viewType.value === ViewMode.New ? new CompanyDirectorLoan() : this.companyDirectorLoan.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyDirectorLoan.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyDirectorLoan.value.id,
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
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyDirectorLoan,
      useCompanyDirectorLoanStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorLoan>(
      this.companyId,
      this.companyDirectorLoan.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
