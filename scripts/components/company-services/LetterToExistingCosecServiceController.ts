import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import type { PropsSwitchDocumentService } from "~/scripts/props/PropsSwitchDocumentService"
import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsLetterChangeReassignCosec } from "~/scripts/props/PropsLetterChangeReassignCosec"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"

export class LetterToExistingCosecServiceController {
  applicationSwitchId: Ref<string> = ref<string>("")
  application: Ref<ApplicationSwitch> = ref<ApplicationSwitch>(new ApplicationSwitch())

  language = useLanguage()

  target: string = CompanyConstants.TARGET_APPLICATION_SWITCH_LETTER

  isLoading: Ref<boolean> = ref<boolean>(false)

  directorName: Ref<string> = ref<string>("")

  documentRef: any | null = null

  emitEvents: any | null = null

  constructor(props: PropsSwitchDocumentService, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsSwitchDocumentService): Promise<void> {
    this.applicationSwitchId.value = props.applicationSwitchId
    await this.fetchApplication()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationSwitchId.value)) {
      return
    }

    try {
      this.isLoading.value = true

      let repository = useApplicationSwitchStore()
      let response = await repository.fetch(this.applicationSwitchId.value)

      this.application.value = new ApplicationSwitch(response)

      if (this.application.value.signatureGroups.length > 0) {
        const firstSignatureGroup = this.application.value.signatureGroups[0]
        const email = firstSignatureGroup.email
        const userRepository = useUserStore()
        const userWhoSigned = await userRepository.fetchByEmail(email)
        if (userWhoSigned) {
          this.directorName.value = userWhoSigned.name
          return
        }
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
    dummyApplication.id = this.applicationSwitchId.value
    dummyApplication.status = "paid"

    let props = new PropsCompanyServiceWrapper(
      dummyApplication, //application
      this.applicationSwitchId.value, //companyId
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

    props.serviceWrapperProps.applicationSwitchId = this.applicationSwitchId.value

    return props
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }

  get signatureUrl(): string {
    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    return this.application.value.signatureGroups[0].signature?.url || ""
  }

  get signatureDate(): string {
    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.application.value.signatureGroups[0].createdAt ?? "") || ""
  }

  get letterChangeReassignCosecProps(): PropsLetterChangeReassignCosec {
    return new PropsLetterChangeReassignCosec(
      this.application.value.name ?? "", //companyName
      this.application.value.registrationNumberNew, //registrationNumberNew
      this.application.value.registrationNumberOld, //registrationNumberOld
      this.application.value.secretaryCompanyName, //cosecCompanyName
      this.application.value.cosecAddressLine1(), //cosecAddressLine1
      this.application.value.cosecAddressLine2(), //cosecAddressLine2
      this.application.value.cosecAddressPostcode(), //cosecAddressPostCode
      this.application.value.cosecAddressCity(), //cosecAddressCity
      this.application.value.cosecAddressState(), //cosecAddressState
      this.application.value.secretaryName, //cosecName
      this.application.value.secretaryEmail, //cosecEmail
      this.application.value.secretaryPhone, //cosecPhone
      this.directorName.value, //directorName
      false, //isDocumentEditable
      true, //isReadonly
      this.signatureUrl, //signatureUrl
      this.signatureDate, //documentDate
      true, //areValuesValid
      "", //validationMessage
      !StringUtil.isNullOrEmpty(this.signatureUrl), //hasSigned
      false, //isSignatureEditable
      false, //isSignatureHidden
      false, //isInPreviewMode
      false, //showWatermark
      "" //watermarkText
    )
  }
}
