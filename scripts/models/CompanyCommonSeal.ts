import { Application } from "./Application"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyCommonSeal
  extends Application
  implements IModelApplication<CompanyCommonSeal, ReturnType<typeof useCompanyCommonSealStore>>
{
  refNo: string = ""
  hasConstitution: string = ""
  imageId: string = ""
  image: File | null = null
  storedAt: string = ""
  authorityOf: string = ""
  directorName: string = ""
  authorisedSignatory: string[] = []
  shippedAt: string = ""
  trackingUrl: string = ""
  trackingNumber: string = ""
  withdrawnAt: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyCommonSeal) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.hasConstitution = data.has_constitution
    this.imageId = data.image_id
    this.image = data.image ? new File(data.image) : null
    this.storedAt = data.stored_at
    this.authorityOf = data.authority_of
    this.directorName = data.director_name
    this.authorisedSignatory = data.authorised_signatory ? data.authorised_signatory.split(",") : []
    this.shippedAt = data.shipped_at
    this.trackingUrl = data.tracking_url
    this.trackingNumber = data.tracking_number
    this.withdrawnAt = data.withdrawn_at
  }

  cloneDetails(data: CompanyCommonSeal): void {
    super.clone(data)
    this.refNo = data.refNo
    this.hasConstitution = data.hasConstitution
    this.imageId = data.imageId
    this.image = data.image ? new File(data.image) : null
    this.storedAt = data.storedAt
    this.authorityOf = data.authorityOf
    this.directorName = data.directorName
    this.authorisedSignatory = data.authorisedSignatory
    this.shippedAt = data.shippedAt
    this.trackingUrl = data.trackingUrl
    this.trackingNumber = data.trackingNumber
    this.withdrawnAt = data.withdrawnAt
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      image_id: this.imageId,
      stored_at: this.storedAt,
      authority_of: this.authorityOf,
      director_name: this.directorName,
      authorised_signatory: this.authorisedSignatory.join(","),
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyCommonSealStore>): Promise<void> {
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

  async update(repository: ReturnType<typeof useCompanyCommonSealStore>): Promise<void> {
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

  async remove(repository: ReturnType<typeof useCompanyCommonSealStore>): Promise<void> {
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
