import { useLocalTime } from "#imports"
import { User } from "~/scripts/models/User"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import type { Application } from "~/scripts/models/Application"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { Error } from "~/scripts/library/Error"
import { ReceiptInvoiceGenerator } from "~/scripts/library/ReceiptInvoiceGenerator"
import { SignatureGroupConstants } from "~/scripts/constants/SignatureGroups"
import { ServiceStepConstants } from "~/scripts/constants/ServiceSteps"
import { StatusConstants } from "~/scripts/constants/Status"
import { StringUtil } from "~/scripts/utils/String"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { ObjectUtil } from "~/scripts/utils/Object"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ServiceStepsController {
  application: Application
  target = ref("")
  currentUser: User = new User()
  receiptInvoiceGenerator: ReceiptInvoiceGenerator = new ReceiptInvoiceGenerator()

  language = useLanguage()
  router = useRouter()

  time = useLocalTime()
  dayjs = useDayjs()

  price = ref<number>(19)
  hasPaid = ref<boolean>(false)
  paymentDate = ref<string>("")
  isDownloadingReceipt = ref<boolean>(false)
  paymentOrderForReceipt = ref<PaymentOrder>(new PaymentOrder())
  paymentOrderIdForReceipt = ref<string | null>(null)

  haveMajorityReached = ref<boolean>(false)
  completedSignatureDate = ref<string>("")

  hasUserSigned = ref<boolean>(false)
  signatureDate = ref<string>("")

  hasDcr = ref<boolean>(false)
  hasMcr = ref<boolean>(false)
  numberOfDirectors = ref<number>(1)
  numberOfShareholders = ref<number>(1)
  directorNumberRanges = ref<number[]>([])
  shareholderNumberRanges = ref<number[]>([])

  isPendingConfirmation = ref<boolean>(false)
  isConfirmed = ref<boolean>(false)
  completedApplicationDate = ref<string>("")

  canSkipToConfirmation = ref<boolean>(false)

  hasMajorityRule = ref<boolean>(false)
  hasCustomAffirmation = ref<boolean>(false)

  currentStep = ref<string>(ServiceStepConstants.PAYMENT)

  receiptRef: any | null = null
  serviceStepsRef: any | null = null

  constructor(
    application: Application,
    target: string,
    price: number,
    hasPaid: boolean,
    haveAllSigned: boolean,
    hasUserSigned: boolean,
    signatureDate: string,
    isDcr: boolean,
    isMcr: boolean,
    numberOfDirectors: number,
    numberOfShareholders: number,
    canSkipToConfirmation: boolean,
    hasMajorityRule: boolean,
    hasCustomAffirmation: boolean
  ) {
    this.application = application
    this.target.value = target
    this.price.value = price
    this.hasPaid.value = hasPaid
    this.haveMajorityReached.value = haveAllSigned
    this.hasUserSigned.value = hasUserSigned
    this.signatureDate.value = signatureDate
    this.hasDcr.value = isDcr
    this.hasMcr.value = isMcr
    this.numberOfDirectors.value = numberOfDirectors
    this.numberOfShareholders.value = numberOfShareholders
    this.canSkipToConfirmation.value = canSkipToConfirmation
    this.hasMajorityRule.value = hasMajorityRule
    this.hasCustomAffirmation.value = hasCustomAffirmation

    this.setValues()
  }

  setApplication(application: Application): void {
    this.application = application

    this.setValues()
  }

  setTarget(target: string): void {
    this.target.value = target
  }

  setCanSkipToConfirmation(canSkipToConfirmation: boolean): void {
    this.canSkipToConfirmation.value = canSkipToConfirmation

    this.setValues()
  }

  setHasCustomAffirmation(hasCustomAffirmation: boolean): void {
    this.hasCustomAffirmation.value = hasCustomAffirmation
  }

  setValues(): void {
    nextTick(() => {
      if (this.hasPaid.value && this.application.paidAt !== null) {
        this.paymentDate.value = this.time.formatDateOnlyShort(this.application.paidAt.toString())
      }

      if (this.hasUserSigned.value) {
        this.signatureDate.value = this.time.formatDateOnlyShort(this.signatureDate.value)
      }

      this.directorNumberRanges.value = Array.from({ length: this.numberOfDirectors.value }, (_, i) => i)
      this.shareholderNumberRanges.value = Array.from({ length: this.numberOfShareholders.value }, (_, i) => i)

      this.isPendingConfirmation.value =
        this.application.status === StatusConstants.SUBMITTED || this.canSkipToConfirmation.value
      this.isConfirmed.value = this.application.status === StatusConstants.CONVERTED

      if (!this.hasPaid.value && !this.canSkipToConfirmation.value) {
        this.currentStep.value = ServiceStepConstants.PAYMENT
      } else if (!this.isAffirmationCompleted() && !this.canSkipToConfirmation.value) {
        this.currentStep.value = ServiceStepConstants.AFFIRMATION
      } else if (
        this.isAffirmationCompleted() &&
        this.application.status !== StatusConstants.SUBMITTED &&
        !this.canSkipToConfirmation.value
      ) {
        this.currentStep.value = ServiceStepConstants.STATUS
      } else if (
        this.application.status === StatusConstants.SUBMITTED ||
        (this.canSkipToConfirmation.value &&
          this.application.status !== StatusConstants.CONVERTED &&
          this.application.status !== StatusConstants.COMPLETED)
      ) {
        this.currentStep.value = ServiceStepConstants.CONFIRMATION
        this.setIsConfirmed()
      } else if (this.application.status === StatusConstants.CONVERTED) {
        this.currentStep.value = ServiceStepConstants.ARCHIVE
        this.completedApplicationDate.value = this.time.formatDateOnlyFull(this.application.deletedAt)
      } else {
        this.currentStep.value = ServiceStepConstants.PAYMENT
      }

      if (this.isConfirmed.value && this.currentStep.value !== ServiceStepConstants.ARCHIVE) {
        this.currentStep.value = ServiceStepConstants.ARCHIVE
      }
    })
  }

  setReceiptRef(receiptRef: any): void {
    this.receiptRef = receiptRef
  }

  isAffirmationCompleted(): boolean {
    if (!this.hasPaid.value) {
      return false
    }

    if (this.canSkipToConfirmation.value) {
      return true
    }

    if (this.hasMajorityRule.value) {
      return this.haveMajorityReached.value
    }

    return this.application.signatureGroups.length > 0
  }

  setServiceStepsRef(serviceStepsRef: any): void {
    this.serviceStepsRef = serviceStepsRef
  }

  numberOfDirectorSignaturesReceived(): number {
    return this.application.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_DIRECTOR
    }).length
  }

  numberOfShareholderSignaturesReceived(): number {
    return this.application.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group !== null && sg.group.target === SignatureGroupConstants.GROUP_SHAREHOLDER
    }).length
  }

  hasDirectorAtIndexSigned(index: number): boolean {
    return index + 1 <= this.numberOfDirectorSignaturesReceived()
  }

  hasShareholderAtIndexSigned(index: number): boolean {
    return index + 1 <= this.numberOfShareholderSignaturesReceived()
  }

  isCurrentStepPayment(): boolean {
    return this.currentStep.value === ServiceStepConstants.PAYMENT
  }

  isCurrentStepAffirmation(): boolean {
    return this.currentStep.value === ServiceStepConstants.AFFIRMATION
  }

  isCurrentStepStatus(): boolean {
    return this.currentStep.value === ServiceStepConstants.STATUS
  }

  isCurrentStepConfirmation(): boolean {
    return this.currentStep.value === ServiceStepConstants.CONFIRMATION
  }

  isCurrentStepArchive(): boolean {
    return this.currentStep.value === ServiceStepConstants.ARCHIVE
  }

  getSignatureDate(): string {
    if (!this.hasDcr.value && !this.hasMcr.value) {
      return this.paymentDate.value
    }

    return this.signatureDate.value
  }

  async onReceiptClicked(): Promise<void> {
    let id = this.application.id

    if (!StringUtil.isNullOrEmpty(this.application.relatedApplicationId)) {
      id = this.application.relatedApplicationId ?? this.application.id
    }

    if (
      StringUtil.isNullOrEmpty(id) ||
      StringUtil.isNullOrEmpty(this.target.value) ||
      !this.hasPaid.value ||
      !this.receiptRef ||
      this.isDownloadingReceipt.value
    ) {
      return
    }

    this.isDownloadingReceipt.value = true

    try {
      this.receiptInvoiceGenerator = new ReceiptInvoiceGenerator()

      let target = this.target.value
      if (!StringUtil.isNullOrEmpty(this.application.relatedApplicationTarget)) {
        target = this.application.relatedApplicationTarget ?? this.target.value
      }

      await this.receiptInvoiceGenerator.setPaymentOrderFromTarget(target, id)
      this.receiptRef.payeeName = this.receiptInvoiceGenerator.payeeName
      this.paymentOrderForReceipt.value = new PaymentOrder(this.receiptInvoiceGenerator.paymentOrder)

      setTimeout(async () => {
        let documentTemplate = this.receiptRef.getDocumentRef()
        if (!documentTemplate) {
          return
        }
        this.receiptInvoiceGenerator.setDocumentTemplate(documentTemplate)
        await this.receiptInvoiceGenerator.download()

        let activityLogger = new ActivityLogger()
        await activityLogger.init()

        await activityLogger.addDownloadLog(this.application.companyId, "receipt", this.target.value, id, "success")
      }, 500)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForGenerateReceipt()
        errorMessage.handle()
      }

      let activityLogger = new ActivityLogger()
      await activityLogger.init()

      await activityLogger.addDownloadLog(
        this.application.companyId,
        `failed to download receipt: ${e}`,
        this.target.value,
        id,
        "failed"
      )
    } finally {
      this.isDownloadingReceipt.value = false
    }
  }

  onRevokeClicked(): void {
    // TODO implement Revoke Resolution
  }

  onAcceptClicked(): void {
    // TODO implement Accept Resolution
  }

  onDocumentsClicked(): void {
    if (!this.application.companyId) {
      return
    }

    this.router.push(`/sdnbhd/${this.application.companyId}/documents`)
  }

  setIsConfirmed(): void {
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 14,
      sameSite: "lax" as const,
      path: "/", // CRITICAL for S3/Cloudflare sub-routes
      secure: true, // Always true for Cloudflare HTTPS
    }
    let cookieName = `cosec_application_${this.application.id}_confirmed`

    const cookie = useCookie<string | null>(cookieName, cookieOptions)
    let currentValue = cookie.value

    this.isConfirmed.value = Boolean(currentValue)
  }

  //Copywritings
  paymentLabel(): string {
    return this.language.isMalay() ? "Bayaran" : "Payment"
  }

  priceFrom(): string {
    return this.language.isMalay() ? "Dari" : "From"
  }

  paymentReceived(): string {
    return this.language.isMalay() ? "Terima" : "Received"
  }

  downloadReceiptButtonLabel(): string {
    return this.language.isMalay() ? "Resit" : "Receipt"
  }

  affirmationLabel(): string {
    return this.language.isMalay() ? "Pengabsahan" : "Affirmation"
  }

  affirmationReceived(): string {
    if (!this.hasDcr.value && !this.hasMcr.value) {
      return this.language.isMalay() ? "Permohonan diterima" : "Application received"
    }

    if (this.haveMajorityReached.value) {
      if (this.hasMajorityRule.value) {
        return this.language.isMalay() ? "Majoriti Dicapai" : "Majority achieved"
      }

      return this.language.isMalay() ? "Tandatangan oleh semua" : "Signed by all"
    }

    if (this.hasUserSigned.value) {
      return this.language.isMalay() ? "Tandatangan diterima" : "Signed"
    }

    return this.language.isMalay() ? "Majoriti dicapai" : "Majority achieved"
  }

  directorLabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  shareholderLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Members"
  }

  notRequiredLabel(): string {
    return this.language.isMalay() ? "Tidak diperlukan" : "Not required"
  }

  statusLabel(): string {
    return this.language.isMalay() ? "Status" : "Status"
  }

  confirmationLabel(): string {
    return this.language.isMalay() ? "Pengesahan" : "Confirmation"
  }

  resolvedResolutionCopywriting(): string {
    return this.language.isMalay()
      ? "DCR ini berkuat kuasa dan terpakai sepenuhnya"
      : "This DCR is in full force and effect"
  }

  confirmationButtonAcceptLabel(): string {
    return this.language.isMalay() ? "Terima" : "Accept"
  }

  confirmationButtonRevokeLabel(): string {
    return this.language.isMalay() ? "Batalkan" : "Revoke"
  }

  confirmationStepsNotesCopywriting(): string {
    return this.language.isMalay()
      ? `Walaupun tiada pengesahan dibuat, DCR ini <br>
        akan dihantar ke Dokumen dalam 14 hari`
      : `Even if no confirmation is made, this DCR <br>
        will be sent to Documents in 14 days`
  }

  pendingFromSSM(): string {
    return this.language.isMalay() ? "Dalam Pertimbangan SSM" : "Pending from SSM"
  }

  completedLabel(): string {
    return this.language.isMalay() ? "Dianggap Diterima" : "Deemed Accepted"
  }

  archiveLabel(): string {
    return this.language.isMalay() ? "Arkib" : "Archive"
  }

  documentButtonLabel(): string {
    return this.language.isMalay() ? "Dokumen" : "Documents"
  }
}
