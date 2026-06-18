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

export class ChangeOfNameApplicationController extends ApplicationController<CompanyAmendmentName> {
  isShowApprovalAction: Ref<boolean> = ref<boolean>(false)
  isUpdatingApprovalStatus: Ref<boolean> = ref<boolean>(false)

  isDownloading: Ref<boolean> = ref<boolean>(false)

  isShowResolutions: Ref<boolean> = ref<boolean>(true)
  isShowSection27: Ref<boolean> = ref<boolean>(false)

  resolutionsRef: any | null = null

  isShowProposedNames: Ref<boolean> = ref<boolean>(false)
  selectedProposedName: Ref<string> = ref<string>("")

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(props.companyId, useCompanyAmendmentNameStore(), CompanyAmendmentName, emitEvents)

    this.minimumMajorityRequired.value = 0.5 // special resolution
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
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
    this.emitEvents("download")
  }

  onApprovalStepClicked(): void {
    this.isShowResolutions.value = true
    this.isShowSection27.value = false
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_RESOLUTIONS)
  }

  onApplicationOfNameReservationClicked(): void {
    this.isShowResolutions.value = false
    this.isShowSection27.value = true
    this.emitEvents("documentSelected", DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27)
  }

  onProposedNamesClicked(): void {
    this.isShowProposedNames.value = !this.isShowProposedNames.value
  }

  onProposedNamesSelected(name: string): void {
    this.isShowProposedNames.value = false
    this.selectedProposedName.value = name
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

  get isNameReservationSubmitted(): boolean {
    return false // set to true for now
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
      this.isNameReservationSubmitted,
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
}
