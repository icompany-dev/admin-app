import { StatusConstants } from "../constants/Status"
import { Company } from "./Company"
import type { IApplication } from "./IApplication"
import { SignatureGroup } from "./SignatureGroup"

export abstract class Application implements IApplication {
  id: string = ""
  companyId: string = ""
  company: Company | null = null
  status: string = StatusConstants.DRAFT
  signatureGroups: Array<SignatureGroup> = []
  signatureGroupStatus: string = ""
  paidAt: string | null = null
  submittedAt: string | null = null
  completedAt: string | null = null
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

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
    this.paidAt = data.paidAt
    this.submittedAt = data.submittedAt
    this.completedAt = data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }
}
