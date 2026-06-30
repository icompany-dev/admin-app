import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"
import { Toast } from "~/scripts/library/Toast"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyNameReservation } from "~/scripts/models/CompanyNameReservation"
import { ObjectUtil } from "~/scripts/utils/Object"
import { File } from "~/scripts/models/File"
import { PropsNameReservationRejected } from "~/scripts/props/PropsNameReservationRejected"
import type { NameReservationRejected } from "~/scripts/types/emit-messages/NameReservationRejected"
import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"

export class ChangeOfNameApplicationController extends ApplicationController<CompanyAmendmentName> {
  isShowApprovalAction: Ref<boolean> = ref<boolean>(false)
  isUpdatingApprovalStatus: Ref<boolean> = ref<boolean>(false)
  isDownloading: Ref<boolean> = ref<boolean>(false)

  isUploadingSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection27Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection27: Ref<boolean> = ref<boolean>(false)

  isDownloadingSection28: Ref<boolean> = ref<boolean>(false)
  isShowSection28Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection28: Ref<boolean> = ref<boolean>(false)

  isUploadingCON: Ref<boolean> = ref<boolean>(false)
  isShowCONActions: Ref<boolean> = ref<boolean>(false)

  isShowCompletedActions: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(true)
  isShowSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection28: Ref<boolean> = ref<boolean>(false)
  isShowCON: Ref<boolean> = ref<boolean>(false)
  isShowComplete: Ref<boolean> = ref<boolean>(false)

  resolutionsRef: any | null = null
  fileInputRef: any | null = null
  nameReservationRejectedPopup: any | null = null
  uploadDocumentPopup: any | null = null

  isShowProposedNames: Ref<boolean> = ref<boolean>(false)
  selectedProposedName: Ref<string> = ref<string>("")

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(props.companyId, useCompanyAmendmentNameStore(), CompanyAmendmentName, emitEvents)

    this.minimumMajorityRequired.value = 0.5 // special resolution
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  setNameReservationRejectedPopup(nameReservationRejectedPopup: any): void {
    this.nameReservationRejectedPopup = nameReservationRejectedPopup
  }

  setUploadDocumentPopup(uploadDocumentPopup: any): void {
    this.uploadDocumentPopup = uploadDocumentPopup
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
      await this.application.value.update(useCompanyAmendmentNameStore())

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
    this.isShowResolutions.value = true
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS)
  }

  onApplicationOfNameReservationClicked(): void {
    this.isShowResolutions.value = false
    this.isShowSection27.value = true
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27)
  }

  onRegistrationOfNameChangedClicked(): void {
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = true
    this.isShowCON.value = false
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28)
  }

  onCertficationOfNameChangeClicked(): void {
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = true
    this.isShowComplete.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28)
  }

  onCompleteNameChangeClicked(): void {
    this.isShowResolutions.value = false
    this.isShowSection27.value = false
    this.isShowSection28.value = false
    this.isShowCON.value = false
    this.isShowComplete.value = true
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_SECTION28)
  }

  onProposedNamesClicked(): void {
    this.isShowProposedNames.value = !this.isShowProposedNames.value
  }

  onProposedNamesSelected(name: string): void {
    this.isShowProposedNames.value = false
    this.selectedProposedName.value = name
  }

  async onSubmitNameReservation(): Promise<void> {
    this.isShowSection27Actions.value = false

    if (this.isUpdatingSection27.value || !this.application.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.selectedProposedName.value)) {
      this.selectedProposedName.value = this.nameOptions[0]
    }

    try {
      this.isUpdatingSection27.value = true

      let newNameReservationApplication = new CompanyNameReservation()
      newNameReservationApplication.amendmentId = this.application.value.id
      newNameReservationApplication.proposedName = this.selectedProposedName.value
        .replace("SDN BHD", "")
        .replace("sdn bhd", "")
        .replace("SDN. BHD.", "")
        .replace("sdn. bhd.", "")
      newNameReservationApplication.nameType = "sdnbhd"
      newNameReservationApplication.status = "paid"

      await newNameReservationApplication.create(useCompanyNameReservationStore())
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
      this.isUpdatingSection27.value = false
    }
  }

  onNameReservationRejectedClicked(): void {
    this.isShowSection27Actions.value = false

    if (this.nameReservationRejectedPopup) {
      this.nameReservationRejectedPopup.show()
    }
  }

  async onProceedNameReservationRejected(details: NameReservationRejected): Promise<void> {
    let application = this.latestSection27Application
    if (!application || this.isUpdatingSection27.value) {
      return
    }

    application.rejectedAt = details.dateRejected
    application.rejectionReason = details.reason

    try {
      this.isUpdatingSection27.value = true
      await application.reject(useCompanyNameReservationStore())
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
      this.isUpdatingSection27.value = false
    }
  }

  async onApproveNameReservation(): Promise<void> {
    this.isShowSection27Actions.value = false

    if (!this.latestSection27Application || this.isUpdatingSection27.value) {
      return
    }

    let application = this.latestSection27Application
    try {
      this.isUpdatingSection27.value = true
      await application.approve(useCompanyNameReservationStore())

      if (this.application.value) {
        this.application.value.confirmedName = new NameReservationVariant(
          application.proposedName,
          application.nameType,
          application.description,
          application.supportingDocumentId
        )

        await this.application.value.update(useCompanyAmendmentNameStore())
      }

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
      this.isUpdatingSection27.value = false
    }
  }

  onShowRegistrationActions(): void {
    this.isShowSection28Actions.value = !this.isShowSection28Actions.value
  }

  async onSubmitToSSMClicked(): Promise<void> {
    this.isShowSection28Actions.value = false

    if (!this.isNameReservationApproved || this.isUpdatingSection28.value || !this.application.value) {
      return
    }

    try {
      this.isUpdatingSection28.value = true
      await this.application.value.submit(useCompanyAmendmentNameStore())
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
    //
  }

  async onProceedShipped(data: any): Promise<void> {
    //
  }

  onShowCompleteActions(): void {
    if (!this.isCONUploaded) {
      return
    }

    this.isShowCompletedActions.value = !this.isShowCompletedActions.value
  }

  async completeServiceClicked(): Promise<void> {
    if (this.isCompleting.value) {
      return
    }

    try {
      this.isCompleting.value = true

      await this.application.value?.complete(useCompanyAmendmentNameStore())
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
    return this.language.isMalay() ? "Tukar Nama Syarikat" : "Change Company Name"
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

  get isNameReservationApproved(): boolean {
    return (
      this.latestSection27Application !== null && this.latestSection27Application.status === StatusConstants.APPROVED
    )
  }

  get nameReservationLabel(): string {
    return this.language.isMalay() ? "Permohonan Tempahan Nama" : "Application of Name Reservation"
  }

  get nameReservationSublabel(): string {
    return this.language.isMalay() ? "Seksyen 27 Akta Syarikat 2016" : "Section 27 of the Act"
  }

  get nameReservationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isShareholderSignatureCompleted,
      this.isNameReservationApproved,
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

  get proposedNamesLabel(): string {
    return this.language.isMalay() ? "Nama yang Dicadangkan" : "Proposed Names"
  }

  get canReservedName(): boolean {
    if (!this.application.value) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.value.confirmedName?.name ?? "")
  }

  get nameReservations(): CompanyNameReservation[] {
    if (!this.application.value) {
      return []
    }

    return ObjectUtil.sort<CompanyNameReservation>(this.application.value.nameReservations, "createdAt", "desc")
  }

  get nameOptions(): string[] {
    if (!this.application.value) {
      return []
    }

    let names: string[] = []

    names.push(this.application.value.name1?.getCompleteName() ?? "")

    if (this.application.value.name2) {
      names.push(this.application.value.name2.getCompleteName())
    }

    if (this.application.value.name3) {
      names.push(this.application.value.name3.getCompleteName())
    }

    return names
  }

  get selectedProposedNameForDisplay(): string {
    if (this.isShowProposedNames.value) {
      return this.language.isMalay() ? "Pilih Nama yang Dicadangkan" : "Select Proposed Name"
    }

    if (!this.application.value) {
      return "PROPOSED NAME"
    }

    if (this.application.value.confirmedName) {
      return this.application.value.confirmedName.getCompleteName()
    }

    let ongoingApplication = this.nameReservations.find((nr: CompanyNameReservation) => {
      return nr.status === StatusConstants.PENDING
    })

    if (ongoingApplication) {
      return ongoingApplication.proposedName
    }

    return this.nameOptions[0]
  }

  get section27Applications(): CompanyNameReservation[] {
    if (!this.application.value) {
      return []
    }

    let nameReservations = this.application.value.nameReservations.map((nr: CompanyNameReservation) => {
      return new CompanyNameReservation(nr)
    })

    let orderedApplications = ObjectUtil.sort<CompanyNameReservation>(nameReservations, "paidAt", "desc")

    return orderedApplications
  }

  get latestSection27Application(): CompanyNameReservation | null {
    if (this.section27Applications.length <= 0) {
      return null
    }

    return this.section27Applications[0]
  }

  get section27ActionLabel(): string {
    return this.language.isMalay() ? "Langkah Seterusnya" : "Next Step"
  }

  get canSubmitSection27(): boolean {
    return !this.latestSection27Application || this.latestSection27Application.status === StatusConstants.REJECTED
  }

  get canUpdateSection27(): boolean {
    return this.latestSection27Application !== null && this.latestSection27Application.status === StatusConstants.PAID
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

  get nameReservationRejectedProps(): PropsNameReservationRejected {
    return new PropsNameReservationRejected(
      this.application.value?.company?.getFullName() ?? "Company",
      this.latestSection27Application?.proposedName ?? "PROPOSED NAME"
    )
  }

  get isRegistrationOfNameSubmitted(): boolean {
    return this.application.value?.status === StatusConstants.SUBMITTED
  }

  get registrationOfNameChangeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isNameReservationApproved,
      this.isRegistrationOfNameSubmitted,
      this.isShowSection28.value
    )
  }

  get certificateOfNameChangeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isRegistrationOfNameSubmitted, this.isCONUploaded, this.isShowCON.value)
  }

  get isCONUploaded(): boolean {
    return false // need to check company documents for this
  }

  get completeApplicationProps(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(this.isCONUploaded, false, this.isShowComplete.value)

    props.isLastNode = true

    return props
  }

  get registrationOfNameChangeLabel(): string {
    return this.language.isMalay() ? "Pendaftaran Pertukaran Nama" : "Registration of Change of Name"
  }

  get registrationOfNameChangeSublabel(): string {
    return this.language.isMalay() ? "Seksyen 28 Akta" : "Section 28 of the Act"
  }

  get canSubmitToSSM(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.isNameReservationApproved && this.application.value.status === StatusConstants.PAID
  }

  get hasSubmittedToSSM(): boolean {
    return (
      this.application.value !== null &&
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING &&
      this.application.value.status !== StatusConstants.PAID
    )
  }

  get registrationOfNameButtonLabel(): string {
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

  get certifcateOfNameChangeLabel(): string {
    return this.language.isMalay() ? "Sijil Pertukaran Nama" : "Certificate of Name Change"
  }

  get certifcateOfNameChangeSublabel(): string {
    return this.language.isMalay() ? "Seksyen 28(4) Akta" : "Section 28(4) of the Act"
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
