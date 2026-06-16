import { StatusConstants } from "~/scripts/constants/Status"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { CompanyServiceController } from "./CompanyServiceController"
import { CompanyTermOfReference } from "~/scripts/models/CompanyTermOfReference"
import { CompanyConstants } from "~/scripts/constants/Company"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class TermsOfReferenceServiceController extends CompanyServiceController<CompanyTermOfReference> {
  companyTermOfReference = ref<CompanyTermOfReference>(new CompanyTermOfReference())

  wrapperRef: any | null = null
  termsOfReferencesRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyTermOfReference, useCompanyTermOfReferenceStore(), emitEvents)

    this.target = CompanyConstants.TARGET_TERMS_OF_REFERENCE
    this.totalPages.value = 5

    this.setViewType(viewType)

    this.initializeData()
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  setTermsOfReferencesRef(termsOfReferencesRef: any | null): void {
    this.termsOfReferencesRef = termsOfReferencesRef
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyTermOfReference.value = new CompanyTermOfReference(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true
          this.isInPreviewMode.value = false
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
        this.companyTermOfReference.value = new CompanyTermOfReference(
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

    this.init(this.companyTermOfReference.value as CompanyTermOfReference)
  }

  override handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }

    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")

    if (this.documentViewMode.value === ViewMode.Preview || this.documentViewMode.value === ViewMode.Enlarged) {
      allPapers.forEach((paper: Element) => {
        let paperElement = paper as HTMLElement
        paperElement.style.display = "block"
      })
      return
    }

    // Show only current page in shrouded mode
    let page = this.currentPage.value
    let paperIdToDisplay = `term-of-reference-${page}`

    allPapers.forEach((paper: Element) => {
      if (!paper.id) {
        return
      }

      let paperElement = paper as HTMLElement
      if (paper.id === paperIdToDisplay) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  getLetterPdfElements(): any[] {
    if (!this.termsOfReferencesRef) {
      return []
    }
    return this.termsOfReferencesRef.getLetterPdfElements()
  }

  isDoneLoading(): boolean {
    return true
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
        this.companyTermOfReference.value.id
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
    if (this.dcrRef) {
      this.companyTermOfReference.value = this.dcrRef.getApplication()
    }

    if (StringUtil.isNullOrEmpty(this.companyTermOfReference.value.id)) {
      this.companyTermOfReference.value.companyId = this.companyId
      await this.companyTermOfReference.value.create(useCompanyTermOfReferenceStore())
    } else {
      await this.companyTermOfReference.value.update(useCompanyTermOfReferenceStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyTermOfReference.value.id) && !this.hasPaid()) {
      await this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  async onApplicationUpdated(application: CompanyTermOfReference): Promise<void> {
    await this.companyServiceInitializer.setExistingApplication()
    this.companyTermOfReference.value = new CompanyTermOfReference(this.companyServiceInitializer.existingApplication)
    if (this.termsOfReferencesRef) {
      this.termsOfReferencesRef.updateApplicationContent(this.companyTermOfReference.value)
    }
  }

  setApplicationData(applicationData: CompanyTermOfReference): void {
    if (!applicationData) {
      return
    }

    if (this.termsOfReferencesRef) {
      this.termsOfReferencesRef.updateApplicationContent(applicationData)
    }
  }

  onWrapperMinimized(applicationData: any): void {
    this.companyTermOfReference.value = new CompanyTermOfReference(applicationData)
    if (this.termsOfReferencesRef) {
      this.termsOfReferencesRef.updateApplicationContent(this.companyTermOfReference.value)
    }
  }

  //copywritings
  slipCaseTitle() {
    return this.language.isMalay() ? "Dalaman: Terma Rujukan (Pengarah)" : "Internal: Terms of Reference (Directors)"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Terma Rujukan" : "Terms of Reference"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Terma Rujukan Lembaga Pengarah menetapkan tanggungjawab, kuasa, dan kewajipan pengarah syarikat.
        <br><br>
        Dokumen ini merangkumi:
        <ul>
          <li>Tujuan dan skop Terma Rujukan</li>
          <li>Kuasa Lembaga Pengarah</li>
          <li>Tugas dan tanggungjawab pengarah</li>
          <li>Kerahsiaan dan larangan keuntungan sulit</li>
          <li>Kelakuan pengarah dan konflik kepentingan</li>
        </ul>
        Terma Rujukan ini membantu memastikan semua pengarah memahami peranan, tanggungjawab, dan kewajipan mereka
        selaras dengan Akta Syarikat 2016.
        <br>
        Asas perundangan: Akta Syarikat 2016, seksyen 213 dan 214.
      `
    }

    return `
      The Terms of Reference for the Board of Directors sets out the responsibilities, powers, and obligations of company directors.
      <br><br>
      This document covers:
      <ul>
        <li>Purpose and scope of the Terms of Reference</li>
        <li>Authority of the Board</li>
        <li>Duties and responsibilities of directors</li>
        <li>Confidentiality and prohibition of secret profits</li>
        <li>Directors' conduct and conflict of interest</li>
      </ul>
      These Terms of Reference help ensure all directors understand their roles, responsibilities, and obligations
      in accordance with the Companies Act 2016.
      <br>
      Legal basis: Companies Act 2016, sections 213 and 214.
    `
  }

  alertTitle(): string {
    return this.language.isMalay() ? "Terma Rujukan" : "Terms of Reference"
  }

  alertContentPointOne(): string {
    return this.language.isMalay()
      ? `
        Terma Rujukan tidak diwajibkan oleh undang-undang, namun ia amat disyorkan sebagai 
        kerangka tadbir urus bagi Lembaga Pengarah yang terdiri daripada lebih daripada <b>dua 
        (2) orang pengarah</b>, bertujuan untuk memberikan kejelasan mengenai bidang kuasa, 
        proses membuat keputusan, dan tadbir urus.
      `
      : `
        A Terms of Reference is not mandated by law but is strongly recommended as governance 
        framework where the Board comprises more than <b>two (2) directors</b>, to provide 
        clarity on authority, decision-making, and governance.
      `
  }

  alertContentPointTwoTooltip(): string {
    return this.language.isMalay()
      ? "Ketidakpatuhan terhadap Terma Rujukan"
      : "Non-compliance with this Terms of Reference,"
  }

  alertContentPointTwo(): string {
    return this.language.isMalay()
      ? `ini, walaupun ia berlaku secara berterusan, tidak dengan sendirinya terjumlah sebagai 
        salah laku atau alasan bagi pemecatan mana-mana Pengarah.`
      : `
        even if persistent shall not of itself constitute misconduct or grounds for the
        removal of any Director
      `
  }

  tooltipTitle(): string {
    return this.language.isMalay() ? "Ketidakpatuhan" : "Non Compliance"
  }

  tooltipContent(): string {
    if (this.language.isMalay()) {
      return `
        Ketidakpatuhan sedemikian, jika ada, membuktikan kelemahan dalam amalan tadbir urus, 
        mencerminkan kekurangan disiplin dalam pembuatan keputusan, dan seterusnya 
        meningkatkan pendedahan Syarikat kepada risiko operasi dan tadbir urus.
        <br><br>
        Ketidakpatuhan yang berterusan, dengan sendirinya, tidak terjumlah sebagai alasan yang 
        mencukupi bagi pemecatan mana-mana pengarah. Walau bagaimanapun, sekiranya ketidakpatuhan 
        tersebut berpunca daripada sikap acuh tidak acuh yang nyata dan seterusnya mengakibatkan 
        kesan buruk yang material kepada Syarikat, ia mungkin mewajarkan pertimbangan lanjut di 
        bawah kerangka tadbir urus dan statutori yang berkuat kuasa.
      `
    }

    return `
      Such non-compliance if any evidences deficiencies in governance practices, reflects a lack 
      of discipline in decision-making, and consequently increases the Company's exposure to 
      operation and governance risks.
      <br><br>
      Persistent non-compliance, in and of itself, does not constitute sufficient grounds for 
      the removal of any director. However, where such non-compliance arises from a demonstrably 
      lackaidaisical attitude and subsequently results in material adverse consequences to the 
      Company, it may warrant further consideration undethe applicable governance and statutory 
      framework.
    `
  }

  get serviceWrapperProps() {
    // let application =
    //   this.viewType.value === ViewMode.New ? new CompanyTermOfReference() : this.companyTermOfReference.value
    // if (this.viewType.value === ViewMode.New) {
    //   application.companyId = this.companyId
    // }

    // let isInPreviewMode = this.isInPreviewMode.value //this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyTermOfReference.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyTermOfReference.value.id,
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
      CompanyTermOfReference,
      useCompanyTermOfReferenceStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyTermOfReference>(
      this.companyId,
      this.companyTermOfReference.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
