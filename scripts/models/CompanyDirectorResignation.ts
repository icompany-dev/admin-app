import { Application } from "./Application"
import { Director } from "./Director"
import { DirectorResignationType } from "~/scripts/constants/DirectorResignations"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "../utils/String"

export class CompanyDirectorResignation
  extends Application
  implements IModelApplication<CompanyDirectorResignation, ReturnType<typeof useCompanyDirectorResignationStore>>
{
  directorId: string = ""
  director: Director = new Director()
  type: string = DirectorResignationType.Immediate
  hasAcknowledgementDcr: boolean = false //NOTE: this needs backend endpoints

  directorName: string = ""
  effectiveDate: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorResignation) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.directorId = data.director_id
    this.director = new Director(data.director)
    this.type = data.type ?? DirectorResignationType.Immediate
    this.hasAcknowledgementDcr = data.has_acknowledgement_dcr ?? false
  }

  cloneDetails(data: any): void {
    super.clone(data)
    this.directorId = data.directorId
    this.director = new Director(data.director)
    this.type = data.type
    this.hasAcknowledgementDcr = data.hasAcknowledgementDcr
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
    }

    if (!StringUtil.isNullOrEmpty(this.directorId)) {
      data.director_id = this.directorId
    }
    if (!StringUtil.isNullOrEmpty(this.type)) {
      data.type = this.type
    }
    if (!StringUtil.isNullOrEmpty(this.status)) {
      data.status = this.status
    }
    if (this.hasAcknowledgementDcr) {
      data.has_acknowledgement_dcr = this.hasAcknowledgementDcr
    }

    return data
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.directorId) &&
      !StringUtil.isNullOrEmpty(this.type)
    )
  }

  async create(repository: ReturnType<typeof useCompanyDirectorResignationStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyDirectorResignationStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyDirectorResignationStore>): Promise<void> {
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

  resigningDirectorName(): string {
    return this.director.user?.name ?? "Unknown Director"
  }

  resigningDirectorIdentificationNo(): string {
    if (!this.director.user) {
      return "Unknown Identification Number"
    }

    let userDetail = this.director.user.detail
    return userDetail?.identification ?? "Unknown Identification Number"
  }

  resigningDirectorIdentificationType(): string {
    if (!this.director.user) {
      return "NRIC"
    }

    let userDetail = this.director.user.detail
    return userDetail?.identificationType === "passport" ? "Passport" : "NRIC"
  }
}
