import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import type { PropsIncorporationDocumentService } from "~/scripts/props/PropsIncorporationDocumentService"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { CompanyConstants } from "~/scripts/constants/Company"

export class Section27OneFourServiceController {
  applicationIncorporationId: Ref<string> = ref<string>("")
  applicationNameReservationId: Ref<string> = ref<string>("")
  applicationNameReservation: Ref<ApplicationNameReservation> = ref<ApplicationNameReservation>(
    new ApplicationNameReservation()
  )

  language = useLanguage()
  repository = useApplicationNameReservationStore()

  target: string = CompanyConstants.TARGET_APPLICATION_INCORPORATE_SECTION27

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  constructor(props: PropsIncorporationDocumentService, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationDocumentService): Promise<void> {
    this.applicationIncorporationId.value = props.applicationIncorporationId
    this.applicationNameReservationId.value = props.applicationNameReservationId

    await this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      if (StringUtil.isNullOrEmpty(this.applicationNameReservationId.value)) {
        this.applicationNameReservation.value = new ApplicationNameReservation()
      } else {
        await this.fetchApplication()
      }
    } catch (e) {
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

  async setApplicationNameReservationId(applicationNameReservationId: string): Promise<void> {
    this.applicationNameReservationId.value = applicationNameReservationId
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationNameReservationId.value)) {
      this.applicationNameReservation.value = new ApplicationNameReservation()
      return
    }

    let response = await this.repository.fetch(this.applicationNameReservationId.value)
    if (this.repository.error !== null) {
      throw this.repository.error
    }

    this.applicationNameReservation.value = new ApplicationNameReservation(response)
  }

  async onApplicationUpdated(): Promise<void> {
    await this.fetchApplication()
  }

  get serviceWrapperProps() {
    let dummyApplication = new CompanyAmendmentName()
    dummyApplication.id = this.applicationIncorporationId.value
    dummyApplication.status = "paid"

    return new PropsCompanyServiceWrapper(
      dummyApplication, //application
      this.applicationIncorporationId.value, //companyId
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
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }
}
