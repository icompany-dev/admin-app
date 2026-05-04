import type { OcrData } from "./OcrData"

export class JobOcrData {
  jobId: string
  ocrData: OcrData

  constructor(jobId: string, ocrData: OcrData) {
    this.jobId = jobId
    this.ocrData = ocrData
  }
}
