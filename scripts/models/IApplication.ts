import type { Company } from "./Company"
import type { SignatureGroup } from "./SignatureGroup"

export interface IApplication {
  id: string
  companyId?: string
  company?: Company | null
  status: string
  signatureGroups: Array<SignatureGroup>
  signatureGroupStatus: string
  paidAt: string | null
  submittedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string
}
