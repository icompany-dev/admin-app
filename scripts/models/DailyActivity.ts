import _ from "lodash"
import { StringUtil } from "../utils/String"
import { ServiceName, ServiceNames } from "../constants/ServiceNames"
import { NumberUtil } from "../utils/Number"

export class DailyActivity {
  companyName: string = ""
  entityType: string = ""
  entityId: string = ""
  action: string = ""
  targetType: string = ""
  targetId: string = ""
  details: any = {}
  actionAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DailyActivity) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyName = data.company_name ?? ""
    this.entityType = data.entity_type ?? ""
    this.entityId = data.entity_id ?? ""
    this.action = data.action ?? ""
    this.targetType = data.target_type ?? ""
    this.targetId = data.target_id ?? ""
    this.details = data.details ? _.cloneDeep(data.details) : {}
    this.actionAt = data.action_at ?? ""
  }

  clone(data: DailyActivity): void {
    this.companyName = data.companyName
    this.entityType = data.entityType
    this.entityId = data.entityId
    this.action = data.action
    this.targetType = data.targetType
    this.targetId = data.targetId
    this.details = _.cloneDeep(data.details)
    this.actionAt = data.actionAt
  }

  get companyNameForDisplay(): string {
    if (StringUtil.isNullOrEmpty(this.companyName)) {
      if (this.targetType === "application_incorporate") {
        return "Incorporation of New Sdn Bhd"
      }

      if (this.targetType === "application_switch") {
        return "Sdn Bhd Switching to iCompany"
      }

      return "Unknown Company"
    }

    return this.companyName
  }

  get actionDescription(): string {
    if (this.action === "payment") {
      return `Made Payment of RM${NumberUtil.currency(this.details.amount ?? 0)}`
    }

    if (this.action === "update") {
      return "Updated Details of Application"
    }

    if (this.action === "incorporation") {
      return "Incorporation in Progress"
    }

    if (this.action === "switch") {
      return "Switch in Progress"
    }

    if (this.action === "signature") {
      return "Affixed Signture"
    }

    return "Updated Details of Application"
  }

  get applicationName(): string {
    let serviceName = ServiceNames.names.find((sn: ServiceName) => {
      return sn.target === this.targetType
    })

    if (!serviceName) {
      return this.targetType
    }

    return serviceName.en
  }

  get actionAtFormatted(): string {
    let time = useLocalTime()
    return time.formatDateTimeFull(this.actionAt)
  }
}
