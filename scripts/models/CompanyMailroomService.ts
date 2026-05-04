import type { useCompanyMailroomServiceStore } from "~/stores/CompanyMailroomServices"
import { Location } from "./Location"
import { Company } from "./Company"
import type { IModel } from "./IModel"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { StatusConstants } from "../constants/Status"

export class CompanyMailroomService implements IModel<CompanyMailroomService> {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  numberOfMails: number = 0
  deliveryCharges: number = 0
  deliveryToName: string = ""
  deliveryToPhone: string = ""
  locationId: string | null = null
  location: Location | null = null
  trackingNumber: string | null = null
  trackingUrl: string | null = null
  remarks: string = ""
  status: string = ""
  notificationLanguage: string = "en"
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyMailroomService) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.numberOfMails = data.number_of_mails
    this.deliveryCharges = data.delivery_charges
    this.deliveryToName = data.delivery_to_name
    this.deliveryToPhone = data.delivery_to_phone
    this.locationId = data.location_id ?? null
    this.location = new Location(data.location)
    this.trackingNumber = data.tracking_number
    this.trackingUrl = data.tracking_url
    this.remarks = data.remarks
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyMailroomService): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.numberOfMails = data.numberOfMails
    this.deliveryCharges = data.deliveryCharges
    this.deliveryToName = data.deliveryToName
    this.deliveryToPhone = data.deliveryToPhone
    this.locationId = data.locationId
    this.location = new Location(data.location)
    this.trackingNumber = data.trackingNumber
    this.trackingUrl = data.trackingUrl
    this.remarks = data.remarks
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.deliveryToName) && !StringUtil.isNullOrEmpty(this.deliveryToPhone)
  }

  getRequestBody(): object {
    return {
      delivery_to_name: this.deliveryToName,
      delivery_to_phone: this.deliveryToPhone,
      location: this.location?.getRequestBody(),
    }
  }

  async create(repository: ReturnType<typeof useCompanyMailroomServiceStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyMailroomServiceStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async extend(repository: ReturnType<typeof useCompanyMailroomServiceStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = {
      status: StatusConstants.EXTENDED,
    }

    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async dispose(repository: ReturnType<typeof useCompanyMailroomServiceStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = {
      status: StatusConstants.TO_DISPOSE,
    }

    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}
