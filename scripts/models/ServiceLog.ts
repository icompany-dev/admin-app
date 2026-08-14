import { StatusConstants } from "../constants/Status"
import { StringUtil } from "../utils/String"

export class ServiceLog {
  companyId: string = ""
  applicationId: string = ""
  createdAt: string = ""
  name: string = ""
  target: string = ""
  decision: string = ""
  status: string = ""
  effectiveDate: string = ""

  constructor() {}

  convertFromResponse(data: any): void {
    this.companyId = data.company_id
    this.applicationId = data.id
    this.createdAt = data.created_at
    this.name = data.name
    this.target = data.target
    this.decision = data.decision
    this.status = data.status
    this.effectiveDate = data.effective_date
  }

  clone(data: ServiceLog): void {
    this.companyId = data.companyId
    this.applicationId = data.applicationId
    this.createdAt = data.createdAt
    this.name = data.name
    this.target = data.target
    this.decision = data.decision
    this.status = data.status
    this.effectiveDate = data.effectiveDate
  }

  decisionCopywriting(): string {
    if (StringUtil.isNullOrEmpty(this.decision)) {
      if (this.status === StatusConstants.WITHDRAWN) {
        return "Withdrawn"
      }

      if (this.status === StatusConstants.DRAFT || this.status === StatusConstants.PENDING) {
        return "Pending Payment"
      }

      if (this.status === StatusConstants.PAID) {
        return "Pending Signature"
      }

      if (
        this.status === StatusConstants.CONVERTED ||
        this.status === StatusConstants.COMPLETED ||
        this.status === StatusConstants.ISSUED ||
        this.status === StatusConstants.RESPONDED
      ) {
        return "Completed"
      }
    }

    return this.decision
      .split(" ")
      .map((c: string) => {
        if (c === "ssm" || c === "smm") {
          return "SSM"
        }

        return `${c.substring(0, 1).toUpperCase()}${c.substring(1)}`
      })
      .join(" ")
  }

  statusCopywriting(): string {
    if (
      this.status === StatusConstants.DRAFT ||
      this.status === StatusConstants.PENDING ||
      this.status === StatusConstants.PAID
    ) {
      return "-"
    }

    if (this.status === StatusConstants.WITHDRAWN) {
      return "No further effect"
    }

    if (this.status === StatusConstants.APPROVED) {
      return "Processing"
    }

    if (
      this.status === StatusConstants.COMPLETED ||
      this.status === StatusConstants.CONVERTED ||
      this.status === StatusConstants.ISSUED
    ) {
      return "Full force & effect"
    }

    return this.status
      .split(" ")
      .map((c: string) => {
        if (c === "ssm" || c === "smm") {
          return "SSM"
        }

        return `${c.substring(0, 1).toUpperCase()}${c.substring(1)}`
      })
      .join(" ")
  }
}
