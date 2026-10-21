import { CompanyConstants } from "~/scripts/constants/Company"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { UploadedDocumentChecker } from "~/scripts/library/UploadedDocumentChecker"
import { Company } from "~/scripts/models/Company"
import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { PropsApplication } from "~/scripts/props/PropsApplication"
import { PropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"
import { PropsFinancialStatementSubmissions } from "~/scripts/props/PropsFinancialStatementSubmissions"
import { PropsServiceWrapper } from "~/scripts/props/PropsServiceWrapper"
import type { CompanyDocument } from "~/scripts/types/CompanyDocument"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class SelectedSdnBhdController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowOptions: Ref<boolean> = ref<boolean>(false)
  isUpdatingDetails: Ref<boolean> = ref<boolean>(false)
  isShowApplicationDocuments: Ref<boolean> = ref<boolean>(false)

  isOverview: Ref<boolean> = ref<boolean>(true)
  isDocuments: Ref<boolean> = ref<boolean>(false)
  isAnnualReturn: Ref<boolean> = ref<boolean>(false)
  isFinancialStatement: Ref<boolean> = ref<boolean>(false)

  //TODO: To remove
  isBusiness: Ref<boolean> = ref<boolean>(false)
  isDirectors: Ref<boolean> = ref<boolean>(false)
  isShareholders: Ref<boolean> = ref<boolean>(false)
  isAccounting: Ref<boolean> = ref<boolean>(false)

  selectedApplicationName: Ref<string> = ref<string>("")
  selectedApplicationId: Ref<string> = ref<string>("")
  selectedPaymentOrderId: Ref<string> = ref<string>("")
  selectedService: Ref<string> = ref<string>(CompanyConstants.TARGET_AMENDMENT_NAME)
  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS)

  documentRef: any | null = null
  isDownloading: Ref<boolean> = ref<boolean>(false)

  spineRef: any | null = null
  generateAuditExemptionCertificateRef: any | null = null
  isPrintingSpine: Ref<boolean> = ref<boolean>(false)

  isNotifyingRegularise: Ref<boolean> = ref<boolean>(false)
  isSettingToStrikedOff: Ref<boolean> = ref<boolean>(false)
  isSettingToSwitchedOut: Ref<boolean> = ref<boolean>(false)

  isAnnualReturnPaid: Ref<boolean> = ref<boolean>(false)
  annualReturnYear: Ref<string> = ref<string>("")

  uploadedDocumentChecker = ref<UploadedDocumentChecker>(new UploadedDocumentChecker(""))

  applicationRefs: any[] = []

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
  }

  async setCompanyId(companyId: string): Promise<void> {
    if (this.companyId.value === companyId) {
      return
    }

    this.companyId.value = companyId
    await this.fetchCompany()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setSpineRef(spineRef: any): void {
    this.spineRef = spineRef
  }

  setGenerateAuditExemptionCertificateRef(val: any): void {
    this.generateAuditExemptionCertificateRef = val
  }

  setApplicationRefs(index: number, ref: any): void {
    this.applicationRefs[index] = ref
  }

  async fetchCompany(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      this.company.value = new Company()
      return
    }

    try {
      this.isLoading.value = true

      let repository = useCompanyStore()
      let response = await repository.fetch(this.companyId.value)

      if (repository.error !== null) {
        throw repository.error
      }

      this.company.value = new Company(response)

      this.uploadedDocumentChecker.value = new UploadedDocumentChecker(this.companyId.value)
      await this.uploadedDocumentChecker.value.fetchDocuments()

      if (!this.hasSubmittedForYear) {
        await this.fetchAnnualReturn()
      } else {
        this.isAnnualReturnPaid.value = true
      }
    } catch (e) {
      this.company.value = new Company()
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchAnnualReturn(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyAnnualReturnStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.take = 5
    filter.sortOrder = "desc"
    filter.orderBy = "year"
    let response = await repository.fetchAll(filter)

    if (response.totalRecords <= 0) {
      this.isAnnualReturnPaid.value = false
      return
    }

    let requestsForYear = response.data
      .map((d: any) => {
        return new CompanyAnnualReturnRequest(d)
      })
      .filter((d: CompanyAnnualReturnRequest) => {
        return d.year === this.yearToLodge
      })

    if (requestsForYear.length <= 0) {
      this.isAnnualReturnPaid.value = false
      return
    }

    let paidForYear = requestsForYear.find((d: CompanyAnnualReturnRequest) => {
      return !StringUtil.isNullOrEmpty(d.paidAt)
    })

    if (!paidForYear) {
      this.isAnnualReturnPaid.value = false
      return
    }

    this.isAnnualReturnPaid.value = true
  }

  onOverviewClicked(): void {
    this.isOverview.value = true
    this.isDocuments.value = false
    this.isAnnualReturn.value = false
    this.isFinancialStatement.value = false
    // this.isBusiness.value = false
    // this.isDirectors.value = false
    // this.isShareholders.value = false
    // this.isAccounting.value = false
  }

  // onBusinessClicked(): void {
  //   this.isOverview.value = false
  //   this.isBusiness.value = true
  //   this.isDirectors.value = false
  //   this.isDocuments.value = false
  //   this.isShareholders.value = false
  //   this.isAccounting.value = false
  // }

  // onDirectorsClicked(): void {
  //   this.isOverview.value = false
  //   this.isBusiness.value = false
  //   this.isDirectors.value = true
  //   this.isDocuments.value = false
  //   this.isShareholders.value = false
  //   this.isAccounting.value = false
  // }

  onDocumentsClicked(): void {
    this.isOverview.value = false
    this.isDocuments.value = true
    this.isAnnualReturn.value = false
    this.isFinancialStatement.value = false
    // this.isBusiness.value = false
    // this.isDirectors.value = false
    // this.isShareholders.value = false
    // this.isAccounting.value = false
  }

  onAnnualReturnClicked(): void {
    this.isOverview.value = false
    this.isDocuments.value = false
    this.isAnnualReturn.value = true
    this.isFinancialStatement.value = false
  }

  onFinancialStatementClicked(): void {
    this.isOverview.value = false
    this.isDocuments.value = false
    this.isAnnualReturn.value = false
    this.isFinancialStatement.value = true
  }

  // onShareholdersClicked(): void {
  //   this.isOverview.value = false
  //   this.isBusiness.value = false
  //   this.isDirectors.value = false
  //   this.isDocuments.value = false
  //   this.isShareholders.value = true
  //   this.isAccounting.value = false
  // }

  // onAccountingClicked(): void {
  //   this.isOverview.value = false
  //   this.isBusiness.value = false
  //   this.isDirectors.value = false
  //   this.isDocuments.value = false
  //   this.isShareholders.value = false
  //   this.isAccounting.value = true
  // }

  onOptionsClicked(): void {
    this.isShowOptions.value = !this.isShowOptions.value
  }

  onEditClicked(): void {
    //
  }

  async onStrikeOffClicked(): Promise<void> {
    if (this.isSettingToStrikedOff.value) {
      return
    }

    try {
      this.isSettingToStrikedOff.value = true
      let repository = useCompanyStore()

      let response = await repository.setToStrikedOff(this.companyId.value)

      if (!response) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Data Sdn Bhd telah berjaya dikemaskini."
        : "You have marked this Sdn Bhd as Striked Off."
      let toastMessage = this.language.isMalay()
        ? "Data ini akan disimpan selama 7 tahun sebelum dilupus."
        : "The data will be retained for the next 7 years."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push("/sdnbhds/all")
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSettingToStrikedOff.value = false
    }
  }

  async onSwitchOutClicked(): Promise<void> {
    if (this.isSettingToSwitchedOut.value) {
      return
    }

    try {
      this.isSettingToSwitchedOut.value = true
      let repository = useCompanyStore()

      let response = await repository.setToSwitchedOut(this.companyId.value)

      if (!response) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Data Sdn Bhd telah berjaya dikemaskini."
        : "You have marked this Sdn Bhd as Switched Out."
      let toastMessage = this.language.isMalay()
        ? "Data ini akan disimpan selama 7 tahun sebelum dilupus."
        : "The data will be retained for the next 7 years."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push("/sdnbhds/all")
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isSettingToSwitchedOut.value = false
    }
  }

  onOpenGenerateAuditExemptionCertificate(): void {
    if (!this.generateAuditExemptionCertificateRef) {
      return
    }

    this.generateAuditExemptionCertificateRef.show()
  }

  onApplicationClicked(selectedService: string): void {
    this.selectedService.value = selectedService
    this.isShowApplicationDocuments.value = true
  }

  onApplicationIdUpdated(id: string): void {
    this.selectedApplicationId.value = id
  }

  onPaymentOrderIdUpdated(id: string): void {
    this.selectedPaymentOrderId.value = id
  }

  onDocumentTargetSelected(target: string, applicationName: string): void {
    this.selectedDocumentTarget.value = target

    this.selectedApplicationName.value = applicationName
  }

  async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value || !this.documentRef) {
      return
    }

    try {
      this.isDownloading.value = true

      await this.documentRef.onDownloadClicked()
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
    }
  }

  onPanelShow(index: number): void {
    this.applicationRefs.forEach((ref: any, i: number) => {
      if (i === index) {
        return
      }

      ref.collapse()
    })
  }

  async onPrintSpineClicked(): Promise<void> {
    if (this.isPrintingSpine.value || !this.spineRef) {
      return
    }

    try {
      this.isPrintingSpine.value = true
      let pages = await this.spineRef.getPdfPages()

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write("Please wait, generating Spince for printing...")
      } else {
        throw "Fail to open new window"
      }

      if (pages.length <= 0) {
        printWindow.close()
        return
      }

      const blob = await PdfPaperUtil.getPdfBlob(pages, 20, "Sdn Bhd Spine.pdf", "a4", "landscape")
      const blobURL = URL.createObjectURL(blob)

      await nextTick()
      printWindow.location.href = blobURL

      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (e) {
      console.error(e)
    } finally {
      this.isPrintingSpine.value = false
    }
  }

  async notifyDocumentRegularised(): Promise<void> {
    if (this.isNotifyingRegularise.value) {
      return
    }

    try {
      this.isNotifyingRegularise.value = true
      let repository = useCompanyStore()
      await repository.notifyRegularise(this.companyId.value)
    } catch (e) {
      //
    } finally {
      this.isNotifyingRegularise.value = false
    }
  }

  onIsAnnualReturnPaidUpdated(isAnnualReturnPaid: boolean): void {
    this.isAnnualReturnPaid.value = isAnnualReturnPaid
  }

  onAnnualReturnYearLodge(yearToLodge: string): void {
    this.annualReturnYear.value = yearToLodge
  }

  get hasCompanyLogo(): boolean {
    return this.company.value.companyLogo !== null && !StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)
  }

  get companyLogo(): string {
    if (!this.company.value.companyLogo || StringUtil.isNullOrEmpty(this.company.value.companyLogo.url)) {
      return "/img/logo/default-logo.png"
    }

    return this.company.value.companyLogo.url
  }

  get more(): string {
    return this.language.isMalay() ? "Lagi" : "More"
  }

  get printSpine(): string {
    return this.language.isMalay() ? "Folder Spine" : " Folder Spine"
  }

  get notifyRegularise(): string {
    return this.language.isMalay() ? "Notify Regularise" : " Notify Regularise"
  }

  get edit(): string {
    return this.language.isMalay() ? "Kemas Kini" : "Edit"
  }

  get strikeOff(): string {
    return this.language.isMalay() ? "Striked Off" : "Striked Off"
  }

  get switchOut(): string {
    return this.language.isMalay() ? "Switched Out" : "Switched Out"
  }

  get auditExemption(): string {
    return this.language.isMalay() ? "Switched Out" : "Switched Out"
  }

  get overview(): string {
    return this.language.isMalay() ? "Overview" : "Overview"
  }

  get business(): string {
    return this.language.isMalay() ? "Perniagaan" : "Business"
  }

  get directors(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get documents(): string {
    return this.language.isMalay() ? "Dokumen" : "Documents"
  }

  get annualReturn(): string {
    return this.language.isMalay()
      ? `Penyata Tahunan untuk ${this.yearToLodge}`
      : `Annual Return for ${this.yearToLodge}`
  }

  get financialStatement(): string {
    return this.language.isMalay() ? "Penyata Kewangan" : "Financial Statement"
  }

  get shareholders(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholders"
  }

  get accounting(): string {
    return this.language.isMalay() ? "Perakaunan" : "Accounting"
  }

  get applicationProps(): PropsApplication {
    return new PropsApplication(this.companyId.value)
  }

  get serviceWrapperProps(): PropsServiceWrapper {
    let props = new PropsServiceWrapper(
      this.companyId.value,
      this.selectedService.value,
      this.selectedApplicationId.value,
      false,
      false
    )

    return props
  }

  get showDocument(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.selectedDocumentTarget.value) && !this.isOverview.value && !this.isDocuments.value
    )
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Butiran Sdn Bhd" : "Sdn Bhd Details"
  }

  get companyDocumentProps(): PropsCompanyDocument {
    return new PropsCompanyDocument(this.companyId.value, new Filter())
  }

  get incorporationDateLabel(): string {
    return this.language.isMalay() ? "Tarikh Diperbadankan" : "Date of Incorporation"
  }

  get incorporationDate(): string {
    if (!this.company.value) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.company.value.incorporatedAt ?? "")
  }

  get yearToLodge(): string {
    let dayjs = useDayjs()

    // if (this.hasSubmittedForYear) {
    //   return dayjs().add(1, "year").format("YYYY")
    // }

    return dayjs().format("YYYY")
  }

  get currentYearAnnualReturnDate(): string {
    let dayjs = useDayjs()

    let currentYear = dayjs().year()
    let incorporatedAt = dayjs(this.company.value.incorporatedAt)

    let annualReturnDate = dayjs(this.company.value.incorporatedAt).year(currentYear)
    return annualReturnDate.format("YYYY-MM-DD")
  }

  get hasSubmittedForYear(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_LODGE_ANNUAL_RETURN,
      this.currentYearAnnualReturnDate
    )
  }

  get latestSection68(): CompanyDocument | null {
    return this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_LODGE_ANNUAL_RETURN,
      this.currentYearAnnualReturnDate
    )
  }

  get isShowWarningForAnnualReturn(): boolean {
    if (this.hasSubmittedForYear) {
      return false
    }

    return !this.isAnnualReturnPaid.value
  }

  get financialStatementSubmissionsProp(): PropsFinancialStatementSubmissions {
    return new PropsFinancialStatementSubmissions(
      this.company.value.id,
      this.company.value.name,
      this.company.value.createdAt,
      null,
      false,
      false
    )
  }
}
