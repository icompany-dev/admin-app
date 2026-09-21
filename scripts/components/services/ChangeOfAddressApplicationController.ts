import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
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

export class ChangeOfAddressApplicationController extends ApplicationController<CompanyAmendmentAddress> {
  isShowApprovalAction: Ref<boolean> = ref<boolean>(false)
  isUpdatingApprovalStatus: Ref<boolean> = ref<boolean>(false)
  isDownloading: Ref<boolean> = ref<boolean>(false)

  isUploadingSection27: Ref<boolean> = ref<boolean>(false)
  isDownloadingSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection27Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection27: Ref<boolean> = ref<boolean>(false)

  isDownloadingPd2: Ref<boolean> = ref<boolean>(false)
  isShowPd2Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingPd2: Ref<boolean> = ref<boolean>(false)

  isUploadingCON: Ref<boolean> = ref<boolean>(false)
  isDownloadingCON: Ref<boolean> = ref<boolean>(false)
  isShowCONActions: Ref<boolean> = ref<boolean>(false)

  isShowCompletedActions: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowSection27: Ref<boolean> = ref<boolean>(false)
  isShowPD2: Ref<boolean> = ref<boolean>(false)
  isShowCON: Ref<boolean> = ref<boolean>(false)
  isShowComplete: Ref<boolean> = ref<boolean>(false)

  resolutionsRef: any | null = null
  fileInputRef: any | null = null
  AddressReservationRejectedPopup: any | null = null
  uploadDocumentPopup: any | null = null

  isShowProposedAddresss: Ref<boolean> = ref<boolean>(false)
  selectedProposedAddress: Ref<string> = ref<string>("")

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyAmendmentAddressStore(),
      CompanyAmendmentAddress,
      CompanyConstants.TARGET_AMENDMENT_ADDRESS,
      emitEvents,
      props.applicationId
    )
    this.target.value = CompanyConstants.TARGET_AMENDMENT_ADDRESS
    this.minimumMajorityRequired.value = 0.5
    this.selectedApprovalType.value = "director" // this is fixed for this service
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  setAddressReservationRejectedPopup(AddressReservationRejectedPopup: any): void {
    this.AddressReservationRejectedPopup = AddressReservationRejectedPopup
  }

  setUploadDocumentPopup(uploadDocumentPopup: any): void {
    this.uploadDocumentPopup = uploadDocumentPopup
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false

    this.emitEvents("applicationId", this.application.value?.id)
    this.emitEvents("paymentOrderId", this.paymentOrderId.value)
    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onShowApprovalActionClicked(): void {
    this.isShowApprovalAction.value = !this.isShowApprovalAction.value
  }

  async onRejectApplicationClicked(): Promise<void> {
    if (this.isUpdatingApprovalStatus.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingApprovalStatus.value = true

      this.application.value.status = StatusConstants.REJECTED
      await this.application.value.update(useCompanyAmendmentAddressStore())

      let toastTitle = this.language.isMalay()
        ? "Status Permohonan telah dikemaskini."
        : "Status of Application has been updated."
      let toastMessage = this.language.isMalay() ? "Permohonan telah ditolak." : "The application is rejected."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingApprovalStatus.value = false
    }
  }

  async onDownloadClicked(): Promise<void> {
    await nextTick()
    this.emitEvents("download")
  }

  onShowSection27ActionClicked(): void {
    this.isShowSection27Actions.value = !this.isShowSection27Actions.value
  }

  async onUploadDocumentClicked(): Promise<void> {
    if (!this.uploadDocumentPopup) {
      return
    }

    this.uploadDocumentPopup.show()
  }

  async onUploadedDocument(): Promise<void> {
    await this.uploadedDocumentChecker.value.fetchDocuments()
  }

  async onDownloadSection28Clicked(): Promise<void> {
    ///
  }

  onApprovalStepClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS)
  }

  onRegistrationOfAddressChangedClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = true
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS)
  }

  onCompleteAddressChangeClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = true
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS)
  }

  onShowRegistrationActions(): void {
    this.isShowPd2Actions.value = !this.isShowPd2Actions.value
  }

  async onSubmitToSSMClicked(): Promise<void> {
    this.isShowPd2Actions.value = false

    if (!this.isAddressReservationApproved || this.isUpdatingPd2.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingPd2.value = true
      await this.application.value.submit(useCompanyAmendmentAddressStore())
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingPd2.value = false
    }
  }

  onShowCONActions(): void {
    this.isShowCONActions.value = !this.isShowCONActions.value
  }

  shipClicked(): void {
    if (!this.shipApplicationRef) {
      return
    }

    this.shipApplicationRef.show()
  }

  onShowCompleteActions(): void {
    // if (!this.isCONUploaded) {
    //   return
    // }

    this.isShowCompletedActions.value = !this.isShowCompletedActions.value
  }

  async completeServiceClicked(): Promise<void> {
    if (this.isCompleting.value || !this.application.value) {
      return
    }

    try {
      this.isCompleting.value = true
      let companyId = this.application.value?.companyId

      await this.application.value?.complete(useCompanyAmendmentAddressStore())

      let router = useRouter()
      router.push({ path: `/sdnbhds/${companyId}` })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isCompleting.value = false
    }
  }

  // getters
  get serviceName(): string {
    return this.language.isMalay() ? "Tukar Alamat Perniagaan" : "Change Business Address"
  }

  get paymentApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get selectedApprovalTypeLabel(): string {
    if (this.isShowApprovalTypeOptions.value) {
      return this.language.isMalay() ? "Pilih Jenis Persetujuan" : "Select Approval Type"
    }

    if (this.selectedApprovalType.value === "director") {
      return this.directorApprovalTypeLabel
    }

    if (this.selectedApprovalType.value === "member") {
      return this.shareholderApprovalTypeLabel
    }

    return this.directorShareholderApprovalTypeLabel
  }

  get directorApprovalTypeLabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get shareholderApprovalTypeLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholders"
  }

  get directorShareholderApprovalTypeLabel(): string {
    return this.language.isMalay() ? "Pengarah & Pemegang Saham" : "Director & Shareholders"
  }

  get approvalLabel(): string {
    return this.language.isMalay() ? "Persetujuan dari Pengarah" : "Approval from Directors"
  }

  get approvalApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      !this.isDirectorSignatureCompleted,
      this.isDirectorSignatureCompleted,
      this.isShowResolutions.value
    )
  }

  get isAddressReservationApproved(): boolean {
    return false
  }

  get AddressReservationLabel(): string {
    return this.language.isMalay() ? "Permohonan Tempahan Nama" : "Application of Address Reservation"
  }

  get AddressReservationSublabel(): string {
    return this.language.isMalay() ? "Seksyen 27 Akta Syarikat 2016" : "Section 27 of the Act"
  }

  get AddressReservationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isShareholderSignatureCompleted,
      this.isAddressReservationApproved,
      this.isShowSection27.value
    )
  }

  get approvalActionLabel(): string {
    if (this.isShowApprovalAction.value) {
      return this.language.isMalay() ? "Pilih Aksi" : "Select Action"
    }

    if (!this.application.value || !this.isShareholderSignatureCompleted) {
      return this.paid
    }

    if (this.application.value.status === StatusConstants.REJECTED) {
      return this.language.isMalay() ? "Telah Ditolak" : "Rejected"
    }

    return this.concluded
  }

  get proposedAddresssLabel(): string {
    return this.language.isMalay() ? "Nama yang Dicadangkan" : "Proposed Addresss"
  }

  // get hasNextStepsForSection27(): boolean {
  //   return this.canSubmitSection27 || this.canUpdateSection27
  // }

  // get canSubmitSection27(): boolean {
  //   return !this.latestSection27Application || this.latestSection27Application.status === StatusConstants.REJECTED
  // }

  // get canUpdateSection27(): boolean {
  //   return this.latestSection27Application !== null && this.latestSection27Application.status === StatusConstants.PAID
  // }

  get submitSection27ApplicationLabel(): string {
    return this.language.isMalay() ? "Hantar" : "Submit"
  }

  get approvedSection27Label(): string {
    return this.language.isMalay() ? "Lulus" : "Approved"
  }

  get rejectedSection27Label(): string {
    return this.language.isMalay() ? "Ditolak" : "Rejected"
  }

  get uploadSection27Label(): string {
    // if (this.isSection27Uploaded) {
    //   return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    // }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get downloadDocumentSection27Label(): string {
    return this.language.isMalay() ? "Seksyen 27" : "Section 27"
  }

  // get AddressReservationRejectedProps(): PropsAddressReservationRejected {
  //   return new PropsAddressReservationRejected(
  //     this.application.value?.company?.getFullAddress() ?? "Company",
  //     this.latestSection27Application?.proposedAddress ?? "PROPOSED Address"
  //   )
  // }

  get isRegistrationOfAddressSubmitted(): boolean {
    return this.application.value?.status === StatusConstants.SUBMITTED
  }

  get registrationOfAddressChangeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isApprovalReceived,
      this.isRegistrationOfAddressSubmitted,
      this.isShowPD2.value
    )
  }

  get certificateOfAddressChangeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isRegistrationOfAddressSubmitted, false, this.isShowCON.value)
  }

  get completeApplicationProps(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(false, false, this.isShowComplete.value)

    props.isLastNode = true

    return props
  }

  get pd2Label(): string {
    return this.language.isMalay() ? "Pemfailan kepada SSM" : "Filing to SSM"
  }

  get pd2Sublabel(): string {
    return this.language.isMalay() ? "Pursuant to Practice Directive 2/207" : "Pursuant to Practice Directive 2/207"
  }

  get canSubmitToSSM(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.status === StatusConstants.PAID && this.isApprovalReceived
  }

  get hasSubmittedToSSM(): boolean {
    return (
      this.application.value !== null &&
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING &&
      this.application.value.status !== StatusConstants.PAID
    )
  }

  get registrationOfAddressButtonLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Submitted"
  }

  get section28ActionLabel(): string {
    return this.language.isMalay() ? "Langkah Seterusnya" : "Next Step"
  }

  get certifcateOfAddressChangeLabel(): string {
    return this.language.isMalay() ? "Sijil Pertukaran Nama" : "Certificate of Address Change"
  }

  get certifcateOfAddressChangeSublabel(): string {
    return this.language.isMalay() ? "Seksyen 28(4) Akta" : "Section 28(4) of the Act"
  }

  // get uploadCONLabel(): string {
  //   if (this.isCONUploaded) {
  //     return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
  //   }

  //   return this.language.isMalay() ? "Muat Naik" : "Upload"
  // }

  get uploadPD2Label(): string {
    if (this.isPD2Uploaded) {
      return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get downloadPD2Label(): string {
    return "PD2"
  }

  get conActionLabel(): string {
    return this.language.isMalay() ? "Langkah Seterusnya" : "Next Step"
  }

  get shipLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Shipped"
  }

  get completeLabel(): string {
    return this.language.isMalay() ? "Lengkap dan Pindah ke Dokumen" : "Completion and Transfer to Documents"
  }

  get completeSublabel(): string {
    return ""
  }

  get completeActionLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Complete"
  }

  // document checkers
  get isPD2Uploaded(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_PD2,
      this.application.value?.createdAt ?? ""
    )
  }

  // get isCONUploaded(): boolean {
  //   return this.uploadedDocumentChecker.value.isDocumentUploaded(
  //     DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28,
  //     this.application.value?.createdAt ?? ""
  //   )
  // }
}
