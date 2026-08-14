export class GeminiAiJobResponse {
  id: string = ""
  success: boolean = false
  message: string = ""
  jobId: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof GeminiAiJobResponse) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.success = data.success ?? false
    this.message = data.message ?? ""
    this.jobId = data.job_id ?? ""
  }

  clone(data: GeminiAiJobResponse): void {
    this.id = data.id
    this.success = data.success
    this.message = data.message
    this.jobId = data.jobId
  }
}
