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

  isDownloadingSection28: Ref<boolean> = ref<boolean>(false)
  isShowSection28Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection28: Ref<boolean> = ref<boolean>(false)

  isUploadingCON: Ref<boolean> = ref<boolean>(false)
  isDownloadingCON: Ref<boolean> = ref<boolean>(false)
  isShowCONActions: Ref<boolean> = ref<boolean>(false)

  isShowCompletedActions: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection28: Ref<boolean> = ref<boolean>(false)
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
      emitEvents
    )
    this.target.value = CompanyConstants.TARGET_AMENDMENT_ADDRESS
    this.minimumMajorityRequired.value = 0.5 // special resolution
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
    this.isShowSection28.value = false
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

  async onDownloadSection28Clicked(): Promise<void> {
    ///
  }

  onApprovalStepClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_RESOLUTIONS)
  }

  onApplicationOfAddressReservationClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = true
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false
    // this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION27)
  }

  onRegistrationOfAddressChangedClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = true
    this.isShowCON.value = false
    this.isShowComplete.value = false
    // this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28)
  }

  onCertficationOfAddressChangeClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = true
    this.isShowComplete.value = false
    // this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28)
  }

  onCompleteAddressChangeClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = true
    // this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28)
  }

  // onProposedAddresssClicked(): void {
  //   this.isShowProposedAddresss.value = !this.isShowProposedAddresss.value
  // }

  // onProposedAddresssSelected(Address: string): void {
  //   this.isShowProposedAddresss.value = false
  //   this.selectedProposedAddress.value = Address
  // }

  // async onSubmitAddressReservation(): Promise<void> {
  //   this.isShowSection27Actions.value = false

  //   if (this.isUpdatingSection27.value || !this.application.value) {
  //     return
  //   }

  //   if (StringUtil.isNullOrEmpty(this.selectedProposedAddress.value)) {
  //     this.selectedProposedAddress.value = this.AddressOptions[0]
  //   }

  //   try {
  //     this.isUpdatingSection27.value = true

  //     let newAddressReservationApplication = new CompanyAddressReservation()
  //     newAddressReservationApplication.amendmentId = this.application.value.id
  //     newAddressReservationApplication.proposedAddress = this.selectedProposedAddress.value
  //       .replace("SDN BHD", "")
  //       .replace("sdn bhd", "")
  //       .replace("SDN. BHD.", "")
  //       .replace("sdn. bhd.", "")
  //     newAddressReservationApplication.AddressType = "sdnbhd"
  //     newAddressReservationApplication.status = "paid"

  //     await newAddressReservationApplication.create(useCompanyAddressReservationStore())
  //     await this.fetchOngoing()
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       e.handle()
  //     } else {
  //       let error = new Error()
  //       error.setForCUD()
  //       error.handle()
  //     }
  //   } finally {
  //     this.isUpdatingSection27.value = false
  //   }
  // }

  // onAddressReservationRejectedClicked(): void {
  //   this.isShowSection27Actions.value = false

  //   if (this.AddressReservationRejectedPopup) {
  //     this.AddressReservationRejectedPopup.show()
  //   }
  // }

  // async onProceedAddressReservationRejected(details: AddressReservationRejected): Promise<void> {
  //   let application = this.latestSection27Application
  //   if (!application || this.isUpdatingSection27.value) {
  //     return
  //   }

  //   application.rejectedAt = details.dateRejected
  //   application.rejectionReason = details.reason

  //   try {
  //     this.isUpdatingSection27.value = true
  //     await application.reject(useCompanyAddressReservationStore())
  //     await this.fetchOngoing()
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       e.handle()
  //     } else {
  //       let error = new Error()
  //       error.setForCUD()
  //       error.handle()
  //     }
  //   } finally {
  //     this.isUpdatingSection27.value = false
  //   }
  // }

  // async onApproveAddressReservation(): Promise<void> {
  //   this.isShowSection27Actions.value = false

  //   if (!this.latestSection27Application || this.isUpdatingSection27.value) {
  //     return
  //   }

  //   let application = this.latestSection27Application
  //   try {
  //     this.isUpdatingSection27.value = true
  //     await application.approve(useCompanyAddressReservationStore())

  //     if (this.application.value) {
  //       this.application.value.confirmedAddress = new AddressReservationVariant(
  //         application.proposedAddress,
  //         application.AddressType,
  //         application.description,
  //         application.supportingDocumentId
  //       )

  //       await this.application.value.update(useCompanyAmendmentAddressStore())
  //     }

  //     await this.fetchOngoing()
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       e.handle()
  //     } else {
  //       let error = new Error()
  //       error.setForCUD()
  //       error.handle()
  //     }
  //   } finally {
  //     this.isUpdatingSection27.value = false
  //   }
  // }

  onShowRegistrationActions(): void {
    this.isShowSection28Actions.value = !this.isShowSection28Actions.value
  }

  async onSubmitToSSMClicked(): Promise<void> {
    this.isShowSection28Actions.value = false

    if (!this.isAddressReservationApproved || this.isUpdatingSection28.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingSection28.value = true
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
      this.isUpdatingSection28.value = false
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
    if (this.isCompleting.value) {
      return
    }

    try {
      this.isCompleting.value = true

      await this.application.value?.complete(useCompanyAmendmentAddressStore())
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

  // async onDownloadSection27Clicked(): Promise<void> {
  //   if (!this.isSection27Uploaded || this.isDownloadingSection27.value) {
  //     return
  //   }

  //   try {
  //     let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
  //       DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION27,
  //       this.application.value?.createdAt ?? ""
  //     )

  //     if (!companyDocument || !companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
  //       throw "new file"
  //     }

  //     this.isDownloadingSection27.value = true
  //     let url = companyDocument.fileUrl

  //     const response = await fetch(url)
  //     if (!response.ok) {
  //       throw "Unable to fetch PDF document from source."
  //     }

  //     const blob = await response.blob()
  //     const blobUrl = window.URL.createObjectURL(blob)
  //     const link = document.createElement("a")
  //     link.href = blobUrl
  //     link.setAttribute("download", companyDocument.documentAddress)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     window.URL.revokeObjectURL(blobUrl)
  //   } catch {
  //     let error = new Error()
  //     error.setForFetch()
  //     error.handle()
  //   } finally {
  //     this.isDownloadingSection27.value = false
  //   }
  // }

  // async onDownloadCONClicked(): Promise<void> {
  //   if (!this.isCONUploaded || this.isDownloadingCON.value) {
  //     return
  //   }

  //   try {
  //     let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
  //       DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28,
  //       this.application.value?.createdAt ?? ""
  //     )

  //     if (!companyDocument || !companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
  //       throw "new file"
  //     }

  //     this.isDownloadingCON.value = true
  //     let url = companyDocument.fileUrl

  //     const response = await fetch(url)
  //     if (!response.ok) {
  //       throw "Unable to fetch PDF document from source."
  //     }

  //     const blob = await response.blob()
  //     const blobUrl = window.URL.createObjectURL(blob)
  //     const link = document.createElement("a")
  //     link.href = blobUrl
  //     link.setAttribute("download", companyDocument.documentAddress)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     window.URL.revokeObjectURL(blobUrl)
  //   } catch {
  //     let error = new Error()
  //     error.setForFetch()
  //     error.handle()
  //   } finally {
  //     this.isDownloadingCON.value = false
  //   }
  // }

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
    return this.language.isMalay() ? "Persetujuan dari" : "Approval from"
  }

  get approvalApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      !this.isShareholderSignatureCompleted,
      this.isShareholderSignatureCompleted,
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
      this.isAddressReservationApproved,
      this.isRegistrationOfAddressSubmitted,
      this.isShowSection28.value
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

    return this.isAddressReservationApproved && this.application.value.status === StatusConstants.PAID
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

  get uploadDocumentProps(): PropsUploadDocument {
    let props = new PropsUploadDocument(this.companyId.value)

    props.canUploadImage = false
    props.canUploadPdf = true

    return props
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

  // document checkers
  // get isSection27Uploaded(): boolean {
  //   return this.uploadedDocumentChecker.value.isDocumentUploaded(
  //     DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION27,
  //     this.application.value?.createdAt ?? ""
  //   )
  // }

  // get isCONUploaded(): boolean {
  //   return this.uploadedDocumentChecker.value.isDocumentUploaded(
  //     DocumentTargets.TARGET_AMENDMENT_ADDRESS_SECTION28,
  //     this.application.value?.createdAt ?? ""
  //   )
  // }
}
