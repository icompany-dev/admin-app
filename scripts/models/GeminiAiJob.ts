import _ from "lodash"

export class GeminiAiJob {
  id: string = ""
  uuid: string = ""
  type: string = ""
  payload: any = null
  status: string = ""
  result: any = null
  errorMessage: string | null = null
  userId: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof GeminiAiJob) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.uuid = data.uuid ?? ""
    this.type = data.type ?? ""
    this.payload = data.payload ? _.cloneDeep(data.payload) : null
    this.status = data.status ?? ""
    this.result = data.result ? _.cloneDeep(data.result) : null
    this.errorMessage = data.error_message ?? ""
    this.userId = data.user_id ?? ""
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  clone(data: GeminiAiJob): void {
    this.id = data.id ?? ""
    this.uuid = data.uuid ?? ""
    this.type = data.type ?? ""
    this.payload = data.payload ? _.cloneDeep(data.payload) : null
    this.status = data.status ?? ""
    this.result = data.result ? _.cloneDeep(data.result) : null
    this.errorMessage = data.errorMessage ?? ""
    this.userId = data.userId ?? ""
    this.createdAt = data.createdAt ?? ""
    this.updatedAt = data.updatedAt ?? ""
  }
}
