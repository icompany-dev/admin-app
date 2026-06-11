import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"

export class ChangeOfNameApplicationController extends ApplicationController<CompanyAmendmentName> {
  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(props.companyId, useCompanyAmendmentNameStore(), CompanyAmendmentName, emitEvents)
  }

  // getters
  get serviceName(): string {
    return this.language.isMalay() ? "Tukar Nama Syarikat" : "Change Company Name"
  }

  get approvalLabel(): string {
    return this.language.isMalay() ? "Persetujuan dari" : "Approval from"
  }

  get isApplicationApproved(): boolean {
    return false
  }

  get approvalApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.isApplicationApproved, this.isApplicationApproved)
  }
}
