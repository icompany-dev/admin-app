import _ from "lodash"
import { GeminiAiSessionJob } from "./GeminiAiSessionJob"
import type { IModel } from "./IModel"
import { StringUtil } from "../utils/String"
import type { useGeminiAiSessionStore } from "~/stores/GeminiAiSessions"
import { Error } from "../library/Error"

export class GeminiAiSession implements IModel<GeminiAiSession> {
  id: string = ""
  target: GeminiAiSessionTarget = new GeminiAiSessionTarget()
  session: any = {}
  aiJobs: GeminiAiSessionJob[] = []
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof GeminiAiSession) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.target = new GeminiAiSessionTarget(data.session_target ?? null)
    this.session = _.cloneDeep(data.session)
    this.aiJobs =
      data.ai_jobs && Array.isArray(data.ai_jobs)
        ? data.ai_jobs.map((d: any) => {
            return new GeminiAiSessionJob(d)
          })
        : []
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: GeminiAiSession): void {
    this.id = data.id
    this.target = new GeminiAiSessionTarget(data.target)
    this.session = _.cloneDeep(data.session)
    this.aiJobs = data.aiJobs.map((d: any) => {
      return new GeminiAiSessionJob(d)
    })
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      target: this.target.type,
      target_id: this.target.id,
      jobs:
        this.aiJobs.length > 0
          ? this.aiJobs.map((aj: GeminiAiSessionJob) => {
              return aj.getRequestBody()
            })
          : null,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.target.type) && !StringUtil.isNullOrEmpty(this.target.id)
  }

  async create(repository: ReturnType<typeof useGeminiAiSessionStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}

export class GeminiAiSessionTarget {
  type: string = ""
  id: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof GeminiAiSessionTarget) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.target_id
    this.type = data.target
  }

  clone(data: GeminiAiSessionTarget): void {
    this.id = data.id
    this.type = data.type
  }
}
