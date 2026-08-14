import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Director } from "~/scripts/models/Director"

export class CompanyDirectorRemoval
  extends Application
  implements IModelApplication<CompanyDirectorRemoval, ReturnType<typeof useCompanyDirectorRemovalStore>>
{
  directorId: string = ""
  director: Director = new Director()
  egmVenue: string | null = null
  egmDate: string | null = null
  egmTime: string | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyDirectorRemoval) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.directorId = data.director_id
    this.director = new Director(data.director)
    this.egmVenue = data.egm_venue
    this.egmDate = data.egm_date
    this.egmTime = data.egm_time
  }

  cloneDetails(data: CompanyDirectorRemoval): void {
    super.clone(data)
    this.directorId = data.directorId
    this.director = new Director(data.director)
    this.egmVenue = data.egmVenue
    this.egmDate = data.egmDate
    this.egmTime = data.egmTime
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      director_id: this.directorId,
      egm_venue: this.egmVenue,
      egm_date: this.egmDate,
      egm_time: this.egmTime,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.directorId)
  }

  async create(repository: ReturnType<typeof useCompanyDirectorRemovalStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDirectorRemovalStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDirectorRemovalStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "Application ID is empty. Please create the application before removing."
      )
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    return response
  }
}
