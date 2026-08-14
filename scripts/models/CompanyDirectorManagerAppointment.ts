import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"

export class CompanyDirectorManagerAppointment
  extends Application
  implements
    IModelApplication<CompanyDirectorManagerAppointment, ReturnType<typeof useCompanyDirectorManagerAppointmentStore>>
{
  refNo: string = ""
  name: string = ""
  identificationType: string = ""
  identification: string = ""
  roleName: string = ""
  termsAndConditions: string = ""
  isUpdateRegistryRequired: boolean = false
  initiatedBy: string = ""
  withdrawnAt: string = ""
  withdrawnBy: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorManagerAppointment) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.name = data.name ?? ""
    this.identificationType = data.identification_type ?? ""
    this.identification = data.identification ?? ""
    this.roleName = data.role_name ?? ""
    this.termsAndConditions = data.terms_and_conditions ?? ""
    this.isUpdateRegistryRequired = data.is_update_registry_required ?? false
    this.initiatedBy = data.initiated_by
    this.withdrawnAt = data.withdrawn_at
    this.withdrawnBy = data.withdrawn_by
  }

  cloneDetails(data: CompanyDirectorManagerAppointment): void {
    super.clone(data)
    this.refNo = data.refNo
    this.name = data.name
    this.identificationType = data.identificationType
    this.identification = data.identification
    this.roleName = data.roleName
    this.termsAndConditions = data.termsAndConditions
    this.isUpdateRegistryRequired = data.isUpdateRegistryRequired
    this.initiatedBy = data.initiatedBy
    this.withdrawnAt = data.withdrawnAt
    this.withdrawnBy = data.withdrawnBy
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      name: this.name,
      identification_type: this.identificationType,
      identification: this.identification,
      role_name: this.roleName,
      terms_and_conditions: this.termsAndConditions,
      is_update_registry_required: this.isUpdateRegistryRequired,
    }
  }

  canSubmit(): boolean {
    if (this.roleName === "Chairman") {
      return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.name)
    }

    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.identificationType) &&
      !StringUtil.isNullOrEmpty(this.identification) &&
      !StringUtil.isNullOrEmpty(this.roleName) &&
      !StringUtil.isNullOrEmpty(this.termsAndConditions)
    )
  }

  async create(repository: ReturnType<typeof useCompanyDirectorManagerAppointmentStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyDirectorManagerAppointmentStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyDirectorManagerAppointmentStore>): Promise<void> {
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

  async postPaymentUpdate(repository: ReturnType<typeof useCompanyDirectorManagerAppointmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
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
}
