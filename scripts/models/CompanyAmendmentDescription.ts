import type { useCompanyAmendmentDescriptionStore } from "~/stores/CompanyAmendmentDescriptions"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { MsicCodeAssign } from "./MsicCodeAssign"
import { Error } from "../library/Error"

export class CompanyAmendmentDescription
  extends Application
  implements IModelApplication<CompanyAmendmentDescription, ReturnType<typeof useCompanyAmendmentDescriptionStore>>
{
  refNo: string = ""
  businessDescription: string = ""
  msicCodeAssigns: MsicCodeAssign[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentDescription) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.businessDescription = data.business_description
    this.msicCodeAssigns =
      data.msic_code_assigns && Array.isArray(data.msic_code_assigns)
        ? data.msic_code_assigns.map((d: any) => {
            return new MsicCodeAssign(d)
          })
        : []
  }

  cloneDetails(data: CompanyAmendmentDescription): void {
    super.clone(data)
    this.refNo = data.refNo
    this.businessDescription = data.businessDescription
    this.msicCodeAssigns = data.msicCodeAssigns.map((d: any) => {
      return new MsicCodeAssign(d)
    })
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
    }

    if (!StringUtil.isNullOrEmpty(this.businessDescription)) {
      data.business_description = this.businessDescription
    }

    return data
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.businessDescription)
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentDescriptionStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentDescriptionStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAmendmentDescriptionStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
