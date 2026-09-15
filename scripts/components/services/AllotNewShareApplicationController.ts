import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"
import { Toast } from "~/scripts/library/Toast"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { StringUtil } from "~/scripts/utils/String"
import { ObjectUtil } from "~/scripts/utils/Object"
import { File } from "~/scripts/models/File"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { CompanyConstants } from "~/scripts/constants/Company"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { Bank } from "~/scripts/models/Bank"
import { Filter } from "~/scripts/library/Filter"
import { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { GenerateDocumentDetails } from "~/scripts/types/GenerateDocumentDetails"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { CompanyShareholderAllotmentDetail } from "~/scripts/models/CompanyShareholderAllotmentDetail"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { ConsiderationType } from "~/scripts/constants/AllotmentOfShares"
import { AllotShares } from "~/scripts/library/AllotShares"
import type { Shareholder } from "~/scripts/models/Shareholder"

export class AllotNewShareApplicationController extends ApplicationController<CompanyShareholderAllotment> {
  resolutionsRef: any | null = null

  allotShares = ref<AllotShares>(new AllotShares("", ""))

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowShipped: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  isGenerating: Ref<boolean> = ref<boolean>(false)
  isApproving: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyShareholderAllotmentStore(),
      CompanyShareholderAllotment,
      CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES,
      emitEvents,
      props.applicationId
    )

    this.minimumMajorityRequired.value = 0
    this.selectedApprovalType.value = "director" // this is fixed for this service
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  override async initializeData(): Promise<void> {
    this.allotShares.value.companyId = this.application.value?.companyId ?? this.companyId.value

    if (StringUtil.isNullOrEmpty(this.allotShares.value.companyId)) {
      return
    }

    await this.allotShares.value.fetchExistingAuthorization()
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onApplicationDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES_RESOLUTIONS)
  }

  async onDownloadClicked(): Promise<void> {
    await nextTick()
    this.emitEvents("download")
  }

  async onPrintClicked(): Promise<void> {
    //
  }

  async onApprovedClicked(): Promise<void> {
    if (!this.application.value) {
      return
    }

    this.isApproving.value = true
    try {
      this.application.value.status = StatusConstants.APPROVED
      await this.application.value.update(useCompanyShareholderAllotmentStore())
      await this.fetchApplication()

      let toastTitle = this.language.isMalay()
        ? "Anda telah mengemaskini status permohonan ini."
        : "You have updated this application status."
      let toastMessage = this.language.isMalay() ? "Sila muat naik Resolusi." : "Please upload the Resolution."

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      if (this.uploadDocumentRef) {
        this.uploadDocumentRef.show()
      }
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isApproving.value = false
    }
  }

  async onProceedPostUpload(): Promise<void> {
    if (this.isCompleting.value) {
      await this.proceedCompleteService()
    }
  }

  async onShippedClicked(): Promise<void> {
    if (this.shipApplicationRef) {
      this.shipApplicationRef.show()
    }
  }

  async onCompleteClicked(): Promise<void> {
    this.isCompleting.value = true
    if (this.uploadDocumentRef) {
      this.uploadDocumentRef.show()

      return
    }

    await this.proceedCompleteService()
  }

  async proceedCompleteService(): Promise<void> {
    if (!this.application.value) {
      return
    }
    try {
      let repository = useCompanyStore()
      await repository.postService(this.target.value, this.application.value.id)

      if (repository.error !== null) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Permohonan telah Selesai. Pengarah Baharu telah ditambah ke Syarikat."
        : "Application is Completed. The new Director has been added to the Company."
      let toastMessage = this.language.isMalay()
        ? "Anda akan dibawa ke muka Sdn Bhd."
        : "You will be redirected to the Sdn Bhd page."

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push({ path: `/sdnbhds/${this.application.value.companyId}` })
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isCompleting.value = false
    }
  }

  getInvitationDetailProp(invitation: DirectorInvitation): PropsInvitationDetail {
    let props = new PropsInvitationDetail(invitation.id, invitation)

    props.hasSection201 = true

    return props
  }

  //getters
  get serviceName(): string {
    return this.language.isMalay() ? "Peruntukkan Saham Baharu" : "Allotment of Shares"
  }

  get paymentApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get applicationDetailsNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isApproved, this.isShowResolutions.value)
  }

  get applicationDetailsLabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }

  get applicationDetailsSublabel(): string {
    return this.language.isMalay()
      ? "Butiran Cadangan Peruntukkan, Seksyen 75 & 76"
      : "Details of Proposed Allotment, Section 75 & 76"
  }

  get allotmentDetails(): CompanyShareholderAllotmentDetail {
    return this.application.value?.details ?? new CompanyShareholderAllotmentDetail()
  }

  get proposalLabel(): string {
    return this.language.isMalay() ? "Cadangan Peruntukkan" : "Proposed Allotment"
  }

  get proposalDetails(): string {
    if (this.language.isMalay()) {
      let considerationType =
        this.allotmentDetails.considerationType === ConsiderationType.FullyPaid
          ? "Bayar Penuh"
          : this.allotmentDetails.considerationType === ConsiderationType.PartiallyPaid
            ? "Bayar Separa"
            : "Tidak Berbayar / Belum Dibayar"

      return `
        <b>Jumlah Saham:</b> ${NumberUtil.thousandSeparator(this.allotmentDetails.numberOfShares)}<br>
        <b>Kelas Saham:</b> ${this.allotmentDetails.typeOfShares === ShareType.Ordinary ? "Ordinary Shares" : "Preference Shares"}<br>
        <b>Harga Sesaham:</b> RM${NumberUtil.currency(this.allotmentDetails.considerationPerShare)}<br>
        <b>Jumlah Keseluruhan:</b> RM${NumberUtil.currency(this.allotmentDetails.proposedTotalSubscriptionAmount)}<br>
        <b>Status Bayaran:</b> ${considerationType}<br>
        <b>Jumlah telah Dibayar:</b> RM ${NumberUtil.currency(this.allotmentDetails.amountPaid ?? "")}
      `
    }

    let considerationType =
      this.allotmentDetails.considerationType === ConsiderationType.FullyPaid
        ? "Fully Paid"
        : this.allotmentDetails.considerationType === ConsiderationType.PartiallyPaid
          ? "Partially Paid"
          : "Unpaid"

    return `
      <b>Number of Shares:</b> ${NumberUtil.thousandSeparator(this.allotmentDetails.numberOfShares)}<br>
      <b>Class of Shares:</b> ${this.allotmentDetails.typeOfShares === ShareType.Ordinary ? "Ordinary Shares" : "Preference Shares"}<br>
      <b>Issue Price per Share:</b> RM${NumberUtil.currency(this.allotmentDetails.considerationPerShare)}<br>
      <b>Total Subscription Amount:</b> RM${NumberUtil.currency(this.allotmentDetails.proposedTotalSubscriptionAmount)}<br>
      <b>Payment Status:</b> ${considerationType}<br>
      <b>Amount Paid:</b> RM ${NumberUtil.currency(this.allotmentDetails.amountPaid ?? "")}
    `
  }

  get section75Label(): string {
    return this.language.isMalay() ? "Seksyen 75 & 76" : "Section 75 & 76"
  }

  get section75Details(): string {
    let signaturesCompleted =
      this.allotShares.value.existingShareAuthorization.signatureGroups.length >= this.shareholders.value.length
    let pendingSignaturesFrom = this.shareholders.value
      .filter((s: Shareholder) => {
        return !this.allotShares.value.existingShareAuthorization.signatureGroups.some((s: SignatureGroup) => {
          return s.group?.target === "shareholder" && s.group?.id === s.id
        })
      })
      .map((s: Shareholder) => {
        return s.fullName().toUpperCase()
      })

    if (signaturesCompleted) {
      return this.language.isMalay() ? "Kelulusan Diterima" : "Approval Received"
    }

    if (this.language.isMalay()) {
      return `
        Menunggu Maklum Balas dari: ${StringUtil.oxfordJoin("&", pendingSignaturesFrom)}
      `
    }

    return `
      Awaiting Response from: ${StringUtil.oxfordJoin("&", pendingSignaturesFrom)}
    `
  }

  get itemsToPrepareLabel(): string {
    return this.language.isMalay() ? "Perkara Tambahan perlu disediakan" : "Additional Items to Prepare"
  }

  get itemsToPrepare(): string[] {
    if (!this.hasOtherRequirements) {
      return []
    }

    let items: string[] = []
    this.paymentOrderItem.optionals.forEach((poio: PaymentOrderItemOptional) => {
      if (!StringUtil.contains(poio.serviceName, "printed") && !!StringUtil.contains(poio.serviceName, "per allotee")) {
        items.push(StringUtil.capitalize(poio.serviceName))
      }
    })

    return items
  }

  get downloadLabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }

  get isApproved(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.APPROVED ||
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get approveLabel(): string {
    return this.language.isMalay() ? "Diluluskan" : "Approved"
  }

  get shipLabel(): string {
    return this.language.isMalay() ? "Hantar" : "Shipped"
  }

  get isShipped(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get deliveryNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isApproved, this.isShipped, this.isShowShipped.value)
  }

  get completedNodeProps(): PropsServiceApplicationNode {
    let isPreviousStepCompleted = this.isDeliveryRequired ? this.isShipped : this.isApproved

    let props = new PropsServiceApplicationNode(isPreviousStepCompleted, this.isCompleted, this.isShowCompleted.value)

    props.isLastNode = true

    return props
  }

  get isCompleted(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get applicationCompletedLabel(): string {
    if (this.isDeliveryRequired) {
      return this.language.isMalay() ? "Dokumen Dihantar" : "Documents Delivered"
    }
    return this.language.isMalay() ? "Permohonan Selesai" : "Completion of Application"
  }

  get completedSublabel(): string {
    return this.language.isMalay() ? "Masukkan Permohonan ke dalam Arkib" : "Move Application to Company Documents"
  }

  get completedStatus(): string {
    if (!this.isCompleted) {
      return this.language.isMalay() ? "Menunggu pengesahan dari klien" : "Pending confirmation from client"
    }

    let time = useLocalTime()

    let completedAt = time.formatDateOnlyFull(this.application.value?.completedAt ?? "")

    return this.language.isMalay() ? `Disahkan pada ${completedAt}` : `Confirmed on ${completedAt}`
  }

  get uploadLabel(): string {
    return this.language.isMalay() ? "Muat Naik Seksyen 58" : "Upload Section 58"
  }

  get markCompletedLabel(): string {
    return this.language.isMalay() ? "Tanda Lengkap" : "Mark Completed"
  }
}
