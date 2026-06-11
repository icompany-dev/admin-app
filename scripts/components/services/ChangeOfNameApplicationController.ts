import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"

export class ChangeOfNameApplicationController extends ApplicationController<CompanyAmendmentName> {
  isShowApprovalTypeOptions: Ref<boolean> = ref<boolean>(false)
  selectedApprovalType: Ref<string> = ref<string>("director-member")

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(props.companyId, useCompanyAmendmentNameStore(), CompanyAmendmentName, emitEvents)
  }

  onApprovalTypeClicked(): void {
    this.isShowApprovalTypeOptions.value = !this.isShowApprovalTypeOptions.value
  }

  onApprovalTypeSelected(type: string): void {
    this.selectedApprovalType.value = type
    this.isShowApprovalTypeOptions.value = false
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

  get isApplicationApproved(): boolean {
    // special resolution. so 75%

    return false
  }

  get approvalApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.isApplicationApproved, this.isApplicationApproved)
  }
}
