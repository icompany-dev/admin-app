import { StatusConstants } from "~/scripts/constants/Status"

export class GeminiAiJobStatusResponse {
  jobId = ""
  systemJobId = ""
  isSuccessful = false
  status = ""
  result = ""
  errorMessage = ""

  constructor(data: any | null = null) {
    if (data === null) {
      this.status = StatusConstants.PENDING
      return
    }

    if (data instanceof GeminiAiJobStatusResponse) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.systemJobId = data.job_id ?? null
    this.isSuccessful = data.success ?? false
    this.status = data.status ?? StatusConstants.FAILED
    this.result = data.result ?? null
    this.errorMessage = data.error_message ?? null
  }

  clone(data: GeminiAiJobStatusResponse): void {
    this.systemJobId = data.jobId
    this.isSuccessful = data.isSuccessful
    this.status = data.status
    this.result = data.result
    this.errorMessage = data.errorMessage
  }

  isPending() {
    return this.status === StatusConstants.PENDING || this.status === StatusConstants.PROCESSING
  }
}
