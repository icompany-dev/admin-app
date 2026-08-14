import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { CompanyServiceController } from "./CompanyServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class Section68ServiceController extends CompanyServiceController<CompanyAnnualReturnRequest> {
  companyAnnualReturnRequest = ref<CompanyAnnualReturnRequest>(new CompanyAnnualReturnRequest())

  wrapperRef: any | null = null

  yearToLodge: Ref<string> = ref<string>("")

  constructor(companyId: string, yearToLodge: string, viewType: string, emitEvents: any | null) {
    super(companyId, false, false, CompanyAnnualReturnRequest, useCompanyAnnualReturnRequestStore(), emitEvents)
    this.target = CompanyConstants.TARGET_LODGE_ANNUAL_RETURN
    this.hasOngoingApplication.value = true
    this.setYearToLodge(yearToLodge)
    this.setViewType("existing")
    this.initializeData()
  }

  setYearToLodge(yearToLodge: string): void {
    this.yearToLodge.value = yearToLodge

    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
    }
  }

  async initializeData(): Promise<void> {
    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    if (StringUtil.isNullOrEmpty(this.companyAnnualReturnRequest.value.id)) {
      this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
    }

    this.init(this.companyAnnualReturnRequest.value as CompanyAnnualReturnRequest)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest()
        this.companyAnnualReturnRequest.value.companyId = this.companyId
        this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
        this.isInPreviewMode.value = true
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      let application = apiRecord.data
        .map((data: any) => {
          return new CompanyAnnualReturnRequest(data)
        })
        .find((record: CompanyAnnualReturnRequest) => {
          return record.year === this.yearToLodge.value
        })

      if (!application) {
        this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest()
        this.companyAnnualReturnRequest.value.companyId = this.companyId
        this.companyAnnualReturnRequest.value.year = this.yearToLodge.value
        this.isInPreviewMode.value = true
        this.hasOngoingApplication.value = false
        this.viewType.value = ViewMode.New
        return
      }

      this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(application)
      let companyRepository = useCompanyStore()
      let companyResponse = await companyRepository.fetch(this.companyId)
      this.companyAnnualReturnRequest.value.company = new Company(companyResponse)
      this.yearToLodge.value = this.companyAnnualReturnRequest.value.year
      this.isInPreviewMode.value = false
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

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyAnnualReturnRequest.value = new CompanyAnnualReturnRequest(applicationData)
    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAnnualReturnRequest.value)
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
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

    let page = this.currentPage.value

    allPapers.forEach((paper: Element, index: number) => {
      if (!paper) {
        return
      }

      let paperElement = paper as HTMLElement
      if (index + 1 === page) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()
    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading

    return isDcrDoneLoading && isWrapperDoneLoading
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Seksyen 68" : "Section 68"
  }

  slipCaseContentPoints(): string[] {
    if (this.language.isMalay()) {
      return [
        "Penyata Tahunan <b>mesti diserah simpan dalam masa 30 hari</b> dari tarikh ulang tahun pemerbadanan anda, tetapi anda boleh buat bayaran terdahulu kepada Sistem iCompany.",
        "Kami tidak mendahulukan atau memberikan diskaun untuk sebarang bayaran bagi pihak anda.<b> Sdn Bhd anda, tanggungjawab anda</b>. Semua harga adalah tetap dan berpatutan, dengan pelbagai saluran pembayaran termasuk BNPL, kad kredit dan banyak lagi.",
        "Jika anda gagal, mengabaikan atau terlepas menyerah simpan Penyata Tahunan anda pada masanya, SSM akan mengenakan <b>fi lewat serah simpan tambahan sehingga RM200</b>, dan denda selanjutnya sehingga RM50,000 bagi ketidakpatuhan yang berterusan.",
      ]
    }

    return [
      "The Annual Return <b>must be lodged within 30 days</b> from your incorporation anniversary date, but you can pay early to iCompany Systems.",
      "We do not advance or discount any payment on your behalf. <b>Your Sdn Bhd, your responsibility</b>. All pricing is fixed and reasonable, with multiple payment channels including BNPL, credit card and more.",
      "If you fail, neglect or omit to lodge your Annual Return on time, SSM will impose an <b>additional late lodgment fee of up to RM200</b>, and further fines of up to RM50,000 for continued non-compliance.",
    ]
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  get serviceWrapperProps() {
    let showPasca = true

    return new PropsCompanyServiceWrapper(
      this.companyAnnualReturnRequest.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAnnualReturnRequest.value.id,
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
      false,
      this.isSubmitting.value,
      CompanyAnnualReturnRequest,
      useCompanyAnnualReturnRequestStore()
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAnnualReturnRequest>(
      this.companyId,
      this.companyAnnualReturnRequest.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
