import _ from "lodash"

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
}
