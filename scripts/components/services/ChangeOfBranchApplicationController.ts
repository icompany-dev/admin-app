import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"
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

export class ChangeOfBranchApplicationController extends ApplicationController<CompanyAmendmentBranch> {
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

  isShowCompletedActions: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowSection27: Ref<boolean> = ref<boolean>(false)
  isShowPD2: Ref<boolean> = ref<boolean>(false)
  isShowComplete: Ref<boolean> = ref<boolean>(false)

  resolutionsRef: any | null = null
  fileInputRef: any | null = null
  uploadDocumentPopup: any | null = null

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyAmendmentBranchStore(),
      CompanyAmendmentBranch,
      CompanyConstants.TARGET_AMENDMENT_BRANCH,
      emitEvents
    )
    this.target.value = CompanyConstants.TARGET_AMENDMENT_BRANCH
    this.minimumMajorityRequired.value = 0.5
    this.selectedApprovalType.value = "director" // this is fixed for this service
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  setUploadDocumentPopup(uploadDocumentPopup: any): void {
    this.uploadDocumentPopup = uploadDocumentPopup
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = false
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
      await this.application.value.update(useCompanyAmendmentBranchStore())

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

  async onDownloadSection28Clicked(): Promise<void> {
    ///
  }

  onApprovalStepClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_BRANCH_RESOLUTIONS)
  }

  onRegistrationOfBranchChangedClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = true
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_PD2)
  }

  onCompleteBranchChangeClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowPD2.value = false
    this.isShowComplete.value = true
    // this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_BRANCH_SECTION28)
  }

  onShowRegistrationActions(): void {
    this.isShowPd2Actions.value = !this.isShowPd2Actions.value
  }

  async onSubmitToSSMClicked(): Promise<void> {
    this.isShowPd2Actions.value = false

    if (this.isUpdatingPd2.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingPd2.value = true
      await this.application.value.submit(useCompanyAmendmentBranchStore())
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
    if (this.isCompleting.value) {
      return
    }

    try {
      this.isCompleting.value = true

      await this.application.value?.complete(useCompanyAmendmentBranchStore())
      await this.fetchOngoing()
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
    return this.language.isMalay() ? "Tukar Alamat Perniagaan" : "Change Business Branch"
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

  get isRegistrationOfBranchSubmitted(): boolean {
    return this.application.value?.status === StatusConstants.SUBMITTED
  }

  get registrationOfBranchChangeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isApprovalReceived,
      this.isRegistrationOfBranchSubmitted,
      this.isShowPD2.value
    )
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

  get registrationOfBranchButtonLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Submitted"
  }

  get section28ActionLabel(): string {
    return this.language.isMalay() ? "Langkah Seterusnya" : "Next Step"
  }

  get uploadDocumentProps(): PropsUploadDocument {
    let props = new PropsUploadDocument(this.companyId.value)

    props.canUploadImage = false
    props.canUploadPdf = true

    return props
  }

  get certifcateOfBranchChangeLabel(): string {
    return this.language.isMalay() ? "Sijil Pertukaran Nama" : "Certificate of Branch Change"
  }

  get certifcateOfBranchChangeSublabel(): string {
    return this.language.isMalay() ? "Seksyen 28(4) Akta" : "Section 28(4) of the Act"
  }

  get downloadDocumentCONLabel(): string {
    return this.language.isMalay() ? "Sijil" : "Certificate"
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
}
