import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"

export class ChangeOfNameApplicationController extends ApplicationController<CompanyAmendmentName> {
  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(props.companyId, useCompanyAmendmentNameStore(), CompanyAmendmentName, emitEvents)
  }

  // getters
  get serviceName(): string {
    return this.language.isMalay() ? "Tukar Nama Syarikat" : "Change Company Name"
  }
}
