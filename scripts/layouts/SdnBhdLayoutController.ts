import { Company } from "../models/Company"
import { useRoute } from "#app"
import { useCompanyStore } from "#imports"
import { Error } from "../library/Error"
import { Compliance } from "../library/Compliance"
import { PaymentConstants } from "../constants/Payment"
import { CompanySetFinancialYearEnd } from "../models/CompanySetFinancialYearEnd"
import { FinancialYearEndConstants } from "../constants/FinancialYearEnds"
import { StatusConstants } from "../constants/Status"
import { CurrentUser } from "../utils/CurrentUser"
import { SidebarOptions } from "../constants/SdnBhdSidebar"
import { LayoutController } from "./LayoutController"
import { DocumentActionType, DocumentActionTypes } from "../constants/DocumentActionTypes"
import { PaymentCart } from "../models/PaymentCart"
import { StringUtil } from "../utils/String"
import { MakePayment } from "../library/MakePayment"
import { CompanyConstants } from "../constants/Company"

export class SdnBhdLayoutController extends LayoutController {
  company = ref<Company>(new Company())
  companyId: string = ""
  isLoading = ref<boolean>(false)
  isStrikingOff = ref<boolean>(false)

  compliance = ref<Compliance>(new Compliance(""))

  route = useRoute()
  router = useRouter()
  companyRepository = useCompanyStore()
  strikingOffRepository = useCompanyStrikingOffResolutionStore()

  complianceAlertSetFyeRef: any | null = null
  isLateLodgementFeesApplicable = ref<boolean>(false)

  complianceAlertResignSoleDirectorRef: any | null = null
  purchaseCorporateProfileRef: any | null = null
  mailroomServiceNoticeRef: any | null = null
  paymentCartStackRef: any | null = null
  resignationOfDirectorToRWarningRef: any | null = null
  pageContentWrapperRef: any | null = null

  documentActionType = ref<DocumentActionType>(DocumentActionTypes.download)

  isResigningAsDirector: Ref<boolean> = ref<boolean>(false)
  isSidebarSpaceAvailable: Ref<boolean> = ref<boolean>(true)

  constructor() {
    super()

    window.addEventListener("resize", this.checkIsSidebarSpaceAvailable.bind(this))
  }

  async init(): Promise<void> {
    const route = useRoute()

    this.companyId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    this.isStrikingOff.value = false // reset the value first
    this.setCompany()
    this.setIsStrikingOff()
    this.compliance.value = new Compliance(this.companyId)
    this.handleCompliance()
    this.initTheme()

    this.checkIsSidebarSpaceAvailable()
  }

  async setCompany(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId)
    if (this.companyRepository.error !== null) {
      let error: Error = new Error("", "")
      error.setForFetch()
      error.handle()

      useRouter().push("/")
      return
    }

    this.company.value = new Company(response)
  }

  async setIsStrikingOff(): Promise<void> {
    let strikingOffResponse = await this.strikingOffRepository.ongoing(this.companyId)
    this.isStrikingOff.value = !StringUtil.isNullOrEmpty(strikingOffResponse?.id ?? "")
  }

  override setPageContentRef(ref: any | null): void {
    this.pageContentRef = ref
    this.checkIsSidebarSpaceAvailable()
  }

  setPageContentWrapperRef(ref: any | null): void {
    this.pageContentWrapperRef = ref
    this.checkIsSidebarSpaceAvailable()
  }

  setComplianceAlertSetFyeRef(complianceAlertSetFyeRef: any): void {
    this.complianceAlertSetFyeRef = complianceAlertSetFyeRef
  }

  setComplianceAlertResignSoleDirectorRef(complianceAlertResignSoleDirectorRef: any): void {
    this.complianceAlertResignSoleDirectorRef = complianceAlertResignSoleDirectorRef
  }

  setPurchaseCorporateProfileRef(purchaseCorporateProfileRef: any): void {
    this.purchaseCorporateProfileRef = purchaseCorporateProfileRef
  }

  setMailroomServiceNoticeRef(mailroomServiceNoticeRef: any): void {
    this.mailroomServiceNoticeRef = mailroomServiceNoticeRef
  }

  setPaymentCartStackRef(paymentCartStackRef: any): void {
    this.paymentCartStackRef = paymentCartStackRef
  }

  setResignationOfDirectorToRWarningRef(resignationOfDirectorToRWarningRef: any): void {
    this.resignationOfDirectorToRWarningRef = resignationOfDirectorToRWarningRef
  }

  handleCompliance(): void {
    if (this.compliance.value.isProcessing) {
      setTimeout(() => {
        this.handleCompliance()
      }, 500)

      return
    }

    if (!this.complianceAlertSetFyeRef || this.compliance.value.hasSetFinancialYearEnd) {
      return
    }

    if (
      this.compliance.value.ongoingCompanySetFinancialYearEnd !== null &&
      this.compliance.value.ongoingCompanySetFinancialYearEnd.status !== StatusConstants.DRAFT &&
      this.compliance.value.ongoingCompanySetFinancialYearEnd.status !== StatusConstants.PENDING
    ) {
      return
    }

    this.isLateLodgementFeesApplicable.value = this.compliance.value.isLateToSetFYE()

    let dayjs = useDayjs()
    let isReminderRequired = dayjs(this.company.value.incorporatedAt).add(6, "months").isBefore(dayjs())

    if (!isReminderRequired && !this.compliance.value.isLateToSetFYE()) {
      return
    }

    this.complianceAlertSetFyeRef.show()
  }

  checkIsSidebarSpaceAvailable(): void {
    if (!this.pageContentRef || !this.pageContentWrapperRef) {
      return
    }

    const sidebarThreshold = 320
    const outerWidth = this.pageContentWrapperRef.offsetWidth
    const innerWidth = this.pageContentRef.offsetWidth

    this.isSidebarSpaceAvailable.value = (outerWidth - innerWidth) / 2 >= sidebarThreshold
  }

  getWrapperStyle(): string {
    if (this.isSidebarSpaceAvailable.value) {
      return ""
    }

    if (!this.pageContentRef || !this.pageContentWrapperRef) {
      return ""
    }

    const isSmallScreen = window.innerWidth < 500
    const buttonThreshold = isSmallScreen ? 250 : 200 // With padding
    const sidebarThreshold = isSmallScreen ? 450 : 350 // With Padding
    const outerWidth = this.pageContentWrapperRef.offsetWidth
    const innerWidth = this.pageContentRef.offsetWidth
    const spaceDiff = outerWidth - innerWidth

    if (this.isSidebarOpenFull()) {
      return `transform: translateX(${sidebarThreshold - spaceDiff / 2}px);`
    }

    if (this.isSidebarOpen()) {
      return `transform: translateX(${buttonThreshold - spaceDiff / 2}px);`
    }

    return ""
  }

  async onPaySetFyeClicked(): Promise<void> {
    let companySetFinancialYearEnd = new CompanySetFinancialYearEnd()
    if (this.compliance.value.ongoingCompanySetFinancialYearEnd === null) {
      companySetFinancialYearEnd.companyId = this.companyId
      companySetFinancialYearEnd.type = FinancialYearEndConstants.AMENDMENT_TYPE_SET
      companySetFinancialYearEnd.status = StatusConstants.DRAFT

      let repository = useCompanySetFinancialYearEndStore()
      await companySetFinancialYearEnd.create(repository)
    } else {
      companySetFinancialYearEnd = new CompanySetFinancialYearEnd(
        this.compliance.value.ongoingCompanySetFinancialYearEnd
      )
    }

    let makePayment = new MakePayment(
      PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
      this.companyId,
      CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END,
      companySetFinancialYearEnd.id
    )
    await makePayment.setPaymentCart()

    this.eventManager.resetMakePaymentValues()
    this.eventManager.setEntityTypeToMakePayment(PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY)
    this.eventManager.setEntityIdToMakePayment(this.companyId)
    this.eventManager.setPaymentCart(makePayment.paymentCart)

    this.eventManager.setMakePayment(true)
  }

  async checkAndRedirectToResignation(): Promise<void> {
    const completeUrl = `/sdnbhd/${this.companyId}/${SidebarOptions.resignAsDirector.url}`

    let directorRepository = useDirectorStore()
    let directorsForCompany = await directorRepository.fetchAllForCompany(this.companyId)
    if (directorsForCompany.length !== 1) {
      this.router.push(completeUrl)
      return
    }

    let currentUser = await CurrentUser.get()
    if (currentUser.email !== directorsForCompany[0].email) {
      this.router.push(completeUrl)
      return
    }

    if (!this.complianceAlertResignSoleDirectorRef) {
      return
    }

    this.complianceAlertResignSoleDirectorRef.show()
  }

  async onResigningAsDirector(): Promise<void> {
    this.isResigningAsDirector.value = true
    let repository = useCompanyTermOfReferenceStore()
    let hasExisting = await repository.hasExisting(this.companyId)
    if (hasExisting && this.resignationOfDirectorToRWarningRef) {
      this.resignationOfDirectorToRWarningRef.show()
      return
    }

    await this.checkAndRedirectToResignation()
  }

  onSSMCorporateProfileClicked(): void {
    this.documentActionType.value = DocumentActionTypes.download
    if (this.purchaseCorporateProfileRef) {
      this.purchaseCorporateProfileRef.show()
    }
  }

  onMailroomServiceClicked(): void {
    if (this.mailroomServiceNoticeRef) {
      this.mailroomServiceNoticeRef.show()
    }
  }

  onOpenMailroomCart(paymentCart: any): void {
    if (!this.paymentCartStackRef) {
      return
    }
    this.paymentCartStackRef.onCartClicked(paymentCart)
  }

  onPurchaseCorporateProfile(cartType: any): void {
    if (!this.paymentCartStackRef) {
      return
    }

    this.paymentCartStackRef.onPurchase(this.companyId)
  }

  isSidebarOpen(): boolean {
    return this.eventManager.isSidebarOpen
  }

  isSidebarOpenFull(): boolean {
    return this.eventManager.isSidebarOpenFull
  }

  onMakePayment(): void {
    if (!this.paymentCartStackRef) {
      return
    }

    if (!this.eventManager.makePayment) {
      return
    }

    let paymentCart = new PaymentCart(this.eventManager.paymentCart)
    this.paymentCartStackRef.onCartClicked(paymentCart)
  }
}
