import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import type { PropsIncorporationDocumentService } from "~/scripts/props/PropsIncorporationDocumentService"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { CompanyConstants } from "~/scripts/constants/Company"

export class Section236ThreeServiceController {
  companyName: Ref<string> = ref<string>("")
  registrationNumberNew: Ref<string> = ref<string>("")
  registrationNumberOld: Ref<string> = ref<string>("")

  language = useLanguage()
  repository = useApplicationNameReservationStore()

  target: string = CompanyConstants.TARGET_APPLICATION_INCORPORATE_SECTION236

  isLoading: Ref<boolean> = ref<boolean>(false)

  documentRef: any | null = null

  emitEvents: any | null = null

  constructor(props: PropsIncorporationDocumentService, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationDocumentService): Promise<void> {
    this.companyName.value = props.companyName
    this.registrationNumberNew.value = props.registrationNumberNew
    this.registrationNumberOld.value = props.registrationNumberOld
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async onDownloadClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return
    }

    await PdfPaperUtil.generatePdfFile(pages, 20, "Section 27(1)(4).pdf", PaperSize.A4, PaperOrientation.Portrait)
  }

  get serviceWrapperProps() {
    let dummyApplication = new CompanyAmendmentName()
    dummyApplication.id = this.registrationNumberNew.value
    dummyApplication.status = "paid"

    let props = new PropsCompanyServiceWrapper(
      dummyApplication, //application
      this.registrationNumberNew.value, //companyId
      this.target, //target
      "", //slipCaseTitle
      "existing", //viewType
      true, //hasOngoingApplication
      true, //hasPastApplications
      dummyApplication.id, //targetId
      1, //currentPage
      1, //totalPages
      "DCR", //earMarkText
      false, //showServiceSteps
      true, //hasPaid
      50, //price
      true, //haveAllSigned
      true, //hasUserSigned
      "", //signatureDate
      false, //isDcr
      false, //isMcr
      1, //numberOfDirectors
      1, //numberOfShareholders
      false, //canSkipToConfirmation
      false, //useDefaultConfirmation
      "", //backButtonLabel
      "", //proceedButtonLabel
      "", //hoveredProceedButtonLabel
      false, //isInPreviewMode
      false, //isMakingPayment
      CompanyAmendmentName, //applicationClassType
      useCompanyAmendmentNameStore(), //repository
      false, //isByShareholder
      true //hasMajorityRule
    )

    props.serviceWrapperProps.companyName = this.companyName.value
    props.serviceWrapperProps.registrationNumberNew = this.registrationNumberNew.value
    props.serviceWrapperProps.registrationNumberOld = this.registrationNumberOld.value

    return props
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }
}
