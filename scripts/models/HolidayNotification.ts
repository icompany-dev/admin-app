import type { IModel } from "./IModel"
import { File } from "./File"

export class HolidayNotification implements IModel<HolidayNotification> {
  id: string = ""
  idNumber: string = ""
  remarks: string = ""
  image: File | null = null
  scheduledStartAt: string = ""
  scheduledEndAt: string = ""

  status: string = ""
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof HolidayNotification) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: HolidayNotification) {
    this.id = data.id
    this.idNumber = data.idNumber
    this.remarks = data.remarks
    this.image = data.image ? new File(data.image) : null
    this.scheduledStartAt = data.scheduledStartAt
    this.scheduledEndAt = data.scheduledEndAt

    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  convertFromResponse(data: any) {
    this.id = data.id ?? ""
    this.idNumber = data.id_number ?? ""
    this.remarks = data.remarks ?? ""
    this.image = data.image ? new File(data.image) : null
    this.scheduledStartAt = data.scheduled_start_at ?? ""
    this.scheduledEndAt = data.scheduled_end_at ?? ""

    this.status = data.status ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  getRequestBody() {
    return {}
  }
}
