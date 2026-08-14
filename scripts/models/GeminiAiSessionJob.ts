import type { useGeminiAiSessionStore } from "~/stores/GeminiAiSessions"
import { StringUtil } from "../utils/String"
import { GeminiAiJob } from "./GeminiAiJob"
import type { IModel } from "./IModel"
import { Error } from "../library/Error"
import { File } from "./File"

export class GeminiAiSessionJob implements IModel<GeminiAiSessionJob> {
  id: string = ""
  sessionId: string = ""
  jobId: string = ""
  job: GeminiAiJob = new GeminiAiJob()
  classifiedJobId: string | null = null
  classifiedJob: GeminiAiJob = new GeminiAiJob()
  documentType: string | null = null
  fileUuid: string | null = null
  fileData: string | null = null
  isOnAws: boolean = false

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof GeminiAiSessionJob) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.sessionId = data.session_id
    this.jobId = data.job_id
    this.job = new GeminiAiJob(data.job)
    this.classifiedJobId = data.classified_job ? data.classified_job.id : null
    this.classifiedJob = new GeminiAiJob(data.classified_job)
    this.documentType = data.document_type ?? null
    this.fileUuid = data.file_uuid ?? null
    this.fileData = data.file_data ?? null
    this.isOnAws = data.is_on_aws ?? false
  }

  clone(data: GeminiAiSessionJob): void {
    this.id = data.id
    this.sessionId = data.sessionId
    this.jobId = data.jobId
    this.job = new GeminiAiJob(data.job)
    this.classifiedJobId = data.classifiedJobId
    this.classifiedJob = new GeminiAiJob(data.classifiedJob)
    this.documentType = data.documentType ?? null
    this.fileUuid = data.fileUuid ?? null
    this.fileData = data.fileData ?? null
    this.isOnAws = data.isOnAws ?? false
  }

  getRequestBody(): object {
    return {
      session_id: this.sessionId,
      job_id: this.jobId,
      document_type: this.documentType,
      file_uuid: this.fileUuid,
      file_data: this.fileData,
      classified_job_id: this.classifiedJobId,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.sessionId) && this.jobId !== null
  }

  async create(repository: ReturnType<typeof useGeminiAiSessionStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const data = this.getRequestBody()
    let response = await repository.addJob(this.sessionId, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useGeminiAiSessionStore>): Promise<any> {
    if (StringUtil.isNullOrEmpty(this.sessionId) || StringUtil.isNullOrEmpty(this.jobId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.removeJob(this.sessionId, this.jobId)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  async addClassifiedJob(repository: ReturnType<typeof useGeminiAiSessionStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.classifiedJobId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const data = this.getRequestBody()
    let response = await repository.addClassifiedJob(this.sessionId, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async getFile(repository: ReturnType<typeof useFileStore>): Promise<File | null> {
    if (!this.isOnAws || StringUtil.isNullOrEmpty(this.fileData)) {
      return null
    }

    let response = await repository.fetch(this.fileData ?? "")
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForFetch()
      throw error
    }

    return new File(response)
  }
}
