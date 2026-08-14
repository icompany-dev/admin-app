import { CompanyAddressSubscription } from "~/scripts/models/CompanyAddressSubscription"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ObjectUtil } from "~/scripts/utils/Object"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class SubscribeBusinessAddressServiceController extends CompanyServiceController<CompanyAddressSubscription> {
  companyAddressSubscription = ref<CompanyAddressSubscription>(new CompanyAddressSubscription())
  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAddressSubscription, useCompanyAddressSubscriptionStore(), emitEvents)
    this.target = CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAddressSubscription.value = new CompanyAddressSubscription(
          this.companyServiceInitializer.newApplication
        )
        await this.fetchPrice()
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
        } else {
          this.hasOngoingApplication.value = false
        }
        this.companyAddressSubscription.value = new CompanyAddressSubscription(
          this.companyServiceInitializer.existingApplication
        )

        // check date
        if (
          this.companyAddressSubscription.value.status !== StatusConstants.PENDING &&
          this.companyAddressSubscription.value.status !== StatusConstants.DRAFT
        ) {
          let today = this.dayjs()
          let createdAt = this.dayjs(this.companyAddressSubscription.value.createdAt ?? "")
          let diff = today.diff(createdAt, "days")
          console.log("diff", diff)
          if (diff >= 14) {
            this.companyAddressSubscription.value.status = StatusConstants.CONVERTED
          }
        }
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAddressSubscription.value as CompanyAddressSubscription)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAddressSubscription.value = new CompanyAddressSubscription()
        this.companyAddressSubscription.value.companyId = this.companyId
        return
      }

      this.companyAddressSubscription.value = new CompanyAddressSubscription(apiRecord.data[0])
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

      let lastApplication = new CompanyAddressSubscription(apiRecord.data[0])
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

    this.companyAddressSubscription.value = new CompanyAddressSubscription(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAddressSubscription.value)
    }
  }

  async onApplicationUpdated(application: CompanyAddressSubscription): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAddressSubscription.value)
    }
  }

  setApplicationData(applicationData: CompanyAddressSubscription): void {
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
        this.companyAddressSubscription.value.id
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
    if (StringUtil.isNullOrEmpty(this.companyAddressSubscription.value.id)) {
      this.companyAddressSubscription.value.companyId = this.companyId
      await this.companyAddressSubscription.value.create(useCompanyAddressSubscriptionStore())
    } else {
      await this.companyAddressSubscription.value.update(useCompanyAddressSubscriptionStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAddressSubscription.value.id) || !this.hasPaid()) {
      this.makePayment()
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

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let changeLabel = this.language.isMalay() ? "Kemaskini Cawangan Syarikat" : "Update Company Branch"
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
    return this.language.isMalay()
      ? "Resolusi: Memperbaharui Penggunaan Alamat Perniagaan"
      : "Resolution: Use of Business Address Service"
  }

  alertTitle(): string {
    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay()
        ? "Maklumat Lanjut: Penggunaan Alamat Perniagaan (Alamat iCompany)"
        : "Learn More: Business Address Service (iCompany Address)"
    }

    return this.language.isMalay()
      ? "Maklumat Lanjut: Penggunaan Alamat Perniagaan"
      : "Learn More: Business Address Service"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      if (this.viewType.value === ViewMode.New) {
        return `
          <ul>
            <li>
              Perkhidmatan ini membenarkan anda menggunakan alamat yang disediakan oleh iCompany 
              sebagai Alamat Perniagaan anda bagi tujuan surat-menyurat dan komunikasi sahaja.
            </li>
            <li>
              Alamat ini adalah terhad untuk kegunaan pos dan komunikasi sahaja. Ia bukan sebuah 
              tempat perniagaan, premis operasi, atau lokasi untuk menjalankan aktiviti komersial. 
              Perkhidmatan ini bertujuan sebagai pengaturan sementara bagi menyokong syarikat anda 
              sementara anda mendapatkan lokasi perniagaan yang sesuai.
            </li>
            <li>
              Sebarang penggunaan alamat mestilah selaras dengan tujuan terhad yang dinyatakan. 
              Jika perlu, anda dikehendaki mengemas kini kepada alamat operasi yang sebenar sebaik 
              sahaja aktiviti perniagaan anda bermula atau berkembang.
            </li>
            <li>
              Penggunaan alamat ini tidak menjejaskan identiti undang-undang, hak, kewajipan, atau 
              tanggungjawab statutori syarikat. Anda tetap bertanggungjawab untuk memastikan butiran 
              berdaftar anda dengan SSM adalah tepat dan mencerminkan operasi perniagaan anda yang 
              sebenar jika berkenaan.
            </li>
            <li>
              Anda diingatkan bahawa semua surat-menyurat rasmi yang diterima di alamat ini akan 
              dikendalikan mengikut proses pengendalian mel dalaman iCompany.
            </li>
          </ul>
          <b>Harga & Terma Umum:</b>
          <ul>
            <li>
              RM199 jika dibayar secara tahunan (termasuk: Resolusi: Penggunaan Perkhidmatan Alamat 
              Perniagaan)
            </li>
            <li>
              RM69 jika dibayar secara suku tahunan
            </li>
            <li>
              Bersamaan dengan +/- RM15/bulan jika dibayar secara tahunan (pembayaran bulanan 
              tidak tersedia)
            </li>
          </ul>
          <b>Reference:</b> Section 46 of the Companies Act 2016
        `
      }

      return `
        Perkhidmatan Alamat Perniagaan disediakan untuk tujuan surat-menyurat, rekod pentadbiran, dan sokongan 
        berkaitan sahaja. 
        <br>
        Alamat ini dimiliki, dikawal, dan diselenggara oleh <b>iCompany Systems</b>, yang dikendalikan oleh 
        <b>Cosec Tech Solutions Sdn Bhd</b>. Alamat ini tidak akan menjadi premis perniagaan sebenar, 
        alamat operasi, alamat cawangan, pejabat berdaftar, kedai, pejabat, atau tempat di mana perniagaan 
        anda dijalankan.
        <br><br>
        Anda dilarang sama sekali menggunakan alamat ini pada cop syarikat, papan tanda, invois, laman web, 
        rekod bank, lesen, rekod cukai, atau pemfailan kawal selia dengan cara yang menunjukkan bahawa 
        syarikat anda beroperasi secara fizikal dari alamat ini, melainkan dibenarkan secara nyata oleh 
        iCompany Systems.
        <br>
        Syarikat anda tetap bertanggungjawab untuk mengisytihar dan mengemas kini alamat perniagaan sebenar, 
        alamat cawangan, pejabat berdaftar, dan butiran berkanun yang lain dengan SSM seperti yang dikehendaki 
        di bawah Akta Syarikat 2016.
        <br><br>
        Sila baca <b><a href="https://www.icompany.my/policy/terms" target="_blank">Terma Perkhidmatan</a></b> 
        dengan teliti sebelum menggunakan perkhidmatan ini. Dengan meneruskan langkah seterusnya, anda mengesahkan 
        bahawa anda memahami kebenaran penggunaan, sekatan, dan had perkhidmatan bagi Perkhidmatan Alamat 
        Perniagaan ini.
      `
    }

    if (this.viewType.value === ViewMode.New) {
      return `
        <ul>
          <li>
            This service allows you to use an iCompany-provided address as your Business Address 
            for mailing and correspondence purposes.
          </li>
          <li>
            The address is strictly for postal and communication use only. It is not a place of 
            business, operational premise, or location for carrying out commercial activities. 
            This service is intended as a temporary arrangement to support your company while 
            you secure a suitable business location.
          </li>
          <li>
            Any use of the address must remain consistent with its limited purpose. Where required, 
            you may need to update to an actual operating address once your business activities 
            commence or expand.
          </li>
          <li>
            The use of this address does not affect the company’s legal identity, rights, obligations, 
            or statutory responsibilities. You remain responsible for ensuring that your registered 
            details with SSM are accurate and reflective of your actual business operations where applicable.
          </li>
          <li>
            You are reminded that all official correspondence received at this address will be 
            handled in accordance with iCompany’s internal mail handling process.
          </li>
        </ul>
        <b>General Pricing & Terms:</b>
        <ul>
          <li>
            RM199 if paid annually (plus: Resolution: Use of Business Address Service)
          </li>
          <li>
            RM69 if paid quarterly 
          </li>
          <li>
            Equivalent to +/- RM15/month if paid annually (monthly payment not available)
          </li>
        </ul>
        <b>Reference:</b> Section 46 of the Companies Act 2016
      `
    }

    return `
      The Business Address Service is provided for mailing, correspondence, administrative records, 
      and related support purposes only.
      <br>
      The address is owned, controlled, and maintained by <b>iCompany Systems</b>, operated by <b>Cosec 
      Tech Solutions Sdn Bhd</b>. It does <b>not</b> become your company’s actual business premises, 
      operating address, branch address, registered office, shop, office, or place where your business 
      is carried on.
      <br><br>
      You must not use this address on your company chop, signboard, invoices, website, bank records, 
      licences, tax records, or regulatory filings in a way that suggests your company physically operates 
      from this address, unless expressly allowed by iCompany Systems.
      <br>
      Your company remains responsible for declaring and updating its actual business address, branch address, 
      registered office, and other statutory particulars with SSM where required under the Companies Act 2016.
      <br><br>
      Please read the <b><a href="https://www.icompany.my/policy/terms" target="_blank">Terms of Service</a></b> 
      carefully before using this service. By proceeding, you confirm that you understand the permitted use, 
      restrictions, and limitations of the Business Address Service.
    `
  }

  completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  deemedAcceptedLabel(): string {
    return this.language.isMalay() ? "Dianggap Selesai" : `Deemed Accepted`
  }

  firstSignatureDate(): string {
    if (this.companyAddressSubscription.value.signatureGroups.length <= 0) {
      return ""
    }

    let sorted = ObjectUtil.sort(this.companyAddressSubscription.value.signatureGroups, "createdAt", "asc").map(
      (d: any) => {
        return new SignatureGroup(d)
      }
    )
    let signatureGroup = sorted[0]

    return this.time.formatDateOnlyShort(signatureGroup.createdAt ?? "")
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

    return this.application.value.paidAt !== null
  }

  override processingLabel(): string {
    return this.language.isMalay() ? "Akan diserah simpan kepada SSM" : "To be lodged with SSM"
  }

  get serviceWrapperProps() {
    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAddressSubscription.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAddressSubscription.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.hasAtLeastOneSignature(),
      this.hasSigned(),
      this.signatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      true,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      isInPreviewMode,
      this.isSubmitting.value,
      CompanyAddressSubscription,
      useCompanyAddressSubscriptionStore(),
      false,
      false
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAddressSubscription>(
      this.companyId,
      this.companyAddressSubscription.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
