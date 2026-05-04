import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Location } from "./Location"
import { useCompanySection47Store } from "~/stores/CompanySection47"
import { User } from "./User"

export class CompanySection47
  extends Application
  implements IModelApplication<CompanySection47, ReturnType<typeof useCompanySection47Store>>
{
  declareBy: User = new User()
  declareById: string = ""

  isKeptAtDifferentAddress: boolean = true
  isLocationUnknown: boolean = false

  items: string[] = []
  additionalItems: string[] = []

  locationId: string = ""
  location: Location = new Location()

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanySection47) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.declareBy = new User(data.declared_by)
    this.declareById = data.declared_by_id
    this.declareBy = new User(data.declared_by)
    this.declareById = data.declared_by_id
    this.isKeptAtDifferentAddress = data.is_kept_at_different_address
    this.isLocationUnknown = data.is_location_unknown
    this.items = !StringUtil.isNullOrEmpty(data.items) ? data.items.split(",") : []
    this.additionalItems = !StringUtil.isNullOrEmpty(data.additional_items) ? data.additional_items.split(",") : []
    this.locationId = data.location_id
    this.location = new Location(data.location)
  }

  cloneDetails(data: CompanySection47): void {
    super.clone(data)
    this.declareBy = data.declareBy
    this.declareById = data.declareById
    this.isKeptAtDifferentAddress = data.isKeptAtDifferentAddress
    this.isLocationUnknown = data.isLocationUnknown
    this.items = data.items
    this.additionalItems = data.additionalItems
    this.locationId = data.locationId
    this.location = new Location(data.location)
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
    }

    const hasAddressDetails =
      this.location.canCreate() ||
      !StringUtil.isNullOrEmpty(this.locationId ?? "") ||
      this.items.length > 0 ||
      this.additionalItems.length > 0
    if (hasAddressDetails) {
      data.is_kept_at_different_address = this.isKeptAtDifferentAddress
      data.is_location_unknown = this.isLocationUnknown
    }
    if (this.items.length > 0) {
      data.items = this.items.join(",")
    }
    if (this.additionalItems.length > 0) {
      data.additional_items = this.additionalItems.join(",")
    }
    if (!StringUtil.isNullOrEmpty(this.locationId ?? "")) {
      data.location_id = this.locationId
    }
    if (this.location.canCreate()) {
      data.location = this.location.getRequestBody()
    }
    if (!StringUtil.isNullOrEmpty(this.status)) {
      data.status = this.status
    }

    return data
  }

  canSubmit(): boolean {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return false
    }

    if (!this.isKeptAtDifferentAddress && !this.isLocationUnknown) {
      return false
    }

    if (this.isKeptAtDifferentAddress && !this.location.canCreate()) {
      return false
    }

    return true
  }

  async create(repository: ReturnType<typeof useCompanySection47Store>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error(Error.ERROR_TYPE_DATA, "Please ensure all required fields have been completed.")
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

  async update(repository: ReturnType<typeof useCompanySection47Store>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error(Error.ERROR_TYPE_DATA, "Please ensure all required fields have been completed.")
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

  async remove(repository: ReturnType<typeof useCompanySection47Store>): Promise<void> {
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
