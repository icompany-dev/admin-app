import { StatusConstants } from "../constants/Status"
import { Company } from "./Company"
import type { IApplication } from "./IApplication"
import { SignatureGroup } from "./SignatureGroup"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { IRepositoryStore } from "./IRepositoryStore"

export abstract class Application implements IApplication {
  id: string = ""
  companyId: string = ""
  company: Company | null = null
  status: string = StatusConstants.DRAFT
  signatureGroups: Array<SignatureGroup> = []
  signatureGroupStatus: string = ""
  initiatorId: string | null = null
  paidAt: string | null = null
  submittedAt: string | null = null
  completedAt: string | null = null
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  // this is for UI purposes
  // We need this for linkage purposes. eg. Transfer of Shares & Register of Transfer
  relatedApplicationId: string | null = null
  relatedApplicationTarget: string | null = null

  protected convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id ? data.company_id : data.company ? data.company?.id : ""
    this.company = new Company(data.company)
    this.status = data.status ?? StatusConstants.DRAFT
    this.signatureGroups =
      data.signature_groups && Array.isArray(data.signature_groups)
        ? data.signature_groups.map((sg: any) => {
            return new SignatureGroup(sg)
          })
        : []
    this.signatureGroupStatus = data.signature_group_status ?? ""
    this.initiatorId = data.initiator_id ?? null
    this.paidAt = data.paid_at ?? null
    this.submittedAt = data.submitted_at ?? null
    this.completedAt = data.completed_at ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? ""
  }

  protected clone(data: Application): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.status = data.status
    this.signatureGroups = data.signatureGroups.map((sg: any) => {
      return new SignatureGroup(sg)
    })
    this.signatureGroupStatus = data.signatureGroupStatus
    this.initiatorId = data.initiatorId
    this.paidAt = data.paidAt
    this.submittedAt = data.submittedAt
    this.completedAt = data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  async submit(repository: IRepositoryStore): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    await repository.submit(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }
  }

  async ship(trackingNumber: string, trackingUrl: string, repository: IRepositoryStore): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    const response = await repository.ship(this.id, trackingNumber, trackingUrl)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }
  }

  async complete(repository: IRepositoryStore): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    await repository.complete(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }
  }
}
