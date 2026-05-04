import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { User } from "./User"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyCommonSealRegister
  extends Application
  implements IModelApplication<CompanyCommonSealRegister, ReturnType<typeof useCompanyCommonSealRegisterStore>>
{
  custodyLocation: string = ""
  usageDescription: string = ""
  dateOfSeal: string = ""
  authorisedPersons: string[] = []
  registeredById: string = ""
  registeredBy: User = new User()

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyCommonSealRegister) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.custodyLocation = data.custody_location ? data.custody_location.replaceAll("\n", "<br>") : ""
    this.usageDescription = data.usage_description
    this.dateOfSeal = data.date_of_seal
    this.authorisedPersons = data.authorised_persons.split(",")
    this.registeredById = data.registered_by_id
    this.registeredBy = new User(data.registered_by)
  }

  cloneDetails(data: CompanyCommonSealRegister): void {
    super.clone(data)
    this.custodyLocation = data.custodyLocation
    this.usageDescription = data.usageDescription
    this.dateOfSeal = data.dateOfSeal
    this.authorisedPersons = data.authorisedPersons
    this.registeredById = data.registeredById
    this.registeredBy = new User(data.registeredBy)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      custody_location: this.custodyLocation,
      usage_description: this.usageDescription,
      date_of_seal: this.dateOfSeal,
      authorised_persons: this.authorisedPersons.join(","),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyCommonSealRegisterStore>): Promise<void> {
    if (!this.canSubmit()) {
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

  async update(repository: ReturnType<typeof useCompanyCommonSealRegisterStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyCommonSealRegisterStore>): Promise<void> {
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
