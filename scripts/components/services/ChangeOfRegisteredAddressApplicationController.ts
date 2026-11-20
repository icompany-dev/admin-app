import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"
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
import type { CompanyDocument } from "~/scripts/types/CompanyDocument"

export class ChangeOfRegisteredAddressApplicationController extends ApplicationController<CompanyAmendmentRegisteredAddress> {
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

  isDownloadingPD2: Ref<boolean> = ref<boolean>(false)

  resolutionsRef: any | null = null
  fileInputRef: any | null = null
  AddressReservationRejectedPopup: any | null = null
  uploadDocumentPopup: any | null = null

  isShowProposedAddresss: Ref<boolean> = ref<boolean>(false)
  selectedProposedAddress: Ref<string> = ref<string>("")

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyAmendmentRegisteredAddressStore(),
      CompanyAmendmentRegisteredAddress,
      CompanyConstants.TARGET_AMENDMENT_ADDRESS,
      emitEvents,
      props.applicationId
    )
    this.target.value = CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS
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
      await this.application.value.update(useCompanyAmendmentRegisteredAddressStore())

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
    this.emitEvents("download")
    // await nextTick()
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
    this.isDownloadingPd2.value = true
    await this.uploadedDocumentChecker.value.fetchDocuments()
    this.isDownloadingPd2.value = false
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
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_RESOLUTIONS)
  }

  onRegistrationOfAddressChangedClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = true
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_RESOLUTIONS)
  }

  onCompleteAddressChangeClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = true
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_RESOLUTIONS)
  }

  onShowRegistrationActions(): void {
    this.isShowPd2Actions.value = !this.isShowPd2Actions.value
  }

  async onDownloadPD2Clicked(): Promise<void> {
    if (!this.isPD2Uploaded || this.isDownloadingPD2.value) {
      return
    }

    try {
      let companyDocument = this.uplaodedPD2

      if (!companyDocument || !companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
        throw "new file"
      }

      this.isDownloadingPD2.value = true
      let url = companyDocument.fileUrl

      const response = await fetch(url)
      if (!response.ok) {
        throw "Unable to fetch PDF document from source."
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.setAttribute("download", companyDocument.documentName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      let error = new Error()
      error.setForFetch()
      error.handle()
    } finally {
      this.isDownloadingPD2.value = false
    }
  }

  async onSubmitToSSMClicked(): Promise<void> {
    this.isShowPd2Actions.value = false

    if (!this.isAddressReservationApproved || this.isUpdatingPd2.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingPd2.value = true
      this.application.value.status = "submitted"
      await this.application.value.submit(useCompanyAmendmentRegisteredAddressStore())
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
    this.isShowCompletedActions.value = !this.isShowCompletedActions.value
  }

  async completeServiceClicked(): Promise<void> {
    if (this.isCompleting.value || !this.application.value) {
      return
    }

    try {
      this.isCompleting.value = true

      let targetId = this.application.value?.id ?? ""
      let repository = useCompanyStore()
      await repository.postService(CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS, targetId, true)

      if (repository.error !== null) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Permohonan telah Selesai. Alamat Berdaftar telah dikemaskini."
        : "Application is Completed. The Registered Address is updated."
      // let toastMessage = this.language.isMalay()
      //   ? "Pengarah telah diberitahu melalui emel dan WhatsApp."
      //   : "Directors are notified via Email and WhatsApp."

      let toast = new Toast(toastTitle, "")
      toast.success()

      let router = useRouter()
      router.push({ path: `/services/change-registered-address` })
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
    return this.language.isMalay() ? "Tukar Alamat Berdaftar" : "Change Registered Address"
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

  get isAddressCompleted(): boolean {
    return !StringUtil.isNullOrEmpty(this.application.value?.newRegisteredAddressLocation?.addressLine1 ?? "")
  }

  get addressLine1(): string {
    return this.application.value?.newRegisteredAddressLocation?.addressLine1 ?? "(Address Incomplete)"
  }

  get hasAddressLine2(): boolean {
    return !StringUtil.isNullOrEmpty(this.application.value?.newRegisteredAddressLocation?.addressLine2 ?? "")
  }

  get addressLine2(): string {
    if (StringUtil.isNullOrEmpty(this.application.value?.newRegisteredAddressLocation?.addressLine2 ?? "")) {
      return "(No Address Line 2)"
    }

    return this.application.value?.newRegisteredAddressLocation?.addressLine2 ?? "(No Address Line 2)"
  }

  get hasAddressLine3(): boolean {
    return !StringUtil.isNullOrEmpty(this.application.value?.newRegisteredAddressLocation?.addressLine3 ?? "")
  }

  get addressLine3(): string {
    if (StringUtil.isNullOrEmpty(this.application.value?.newRegisteredAddressLocation?.addressLine3 ?? "")) {
      return "(No Address Line 3)"
    }

    return this.application.value?.newRegisteredAddressLocation?.addressLine3 ?? "(No Address Line 3)"
  }

  get postcode(): string {
    return this.application.value?.newRegisteredAddressLocation?.postcode ?? ""
  }

  get cityName(): string {
    return this.application.value?.newRegisteredAddressLocation?.city?.name ?? ""
  }

  get stateName(): string {
    return this.application.value?.newRegisteredAddressLocation?.state?.name ?? ""
  }

  get countryName(): string {
    return this.application.value?.newRegisteredAddressLocation?.country?.name ?? ""
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
    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get downloadDocumentSection27Label(): string {
    return this.language.isMalay() ? "Seksyen 27" : "Section 27"
  }

  get isRegistrationOfAddressSubmitted(): boolean {
    return this.application.value?.status === StatusConstants.SUBMITTED || this.isPD2Uploaded
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
    let props = new PropsServiceApplicationNode(this.isRegistrationOfAddressSubmitted, false, this.isShowComplete.value)

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

    return this.application.value.status === StatusConstants.PAID
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
      DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_PD2,
      this.application.value?.paidAt ?? ""
    )
  }

  get pd2FileLabel(): string {
    return "PD2 - Change of Registered Address"
  }

  get uplaodedPD2(): CompanyDocument | null {
    if (!this.isPD2Uploaded) {
      return null
    }

    let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_AMENDMENT_REGISTERED_ADDRESS_PD2,
      this.application.value?.paidAt ?? ""
    )

    return companyDocument ?? null
  }
}
