import { StatusConstants } from "../constants/Status"
import type { GeminiAiJobStatusResponse } from "../models/GeminiAiJobStatusResponse"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { GeminiAi } from "./GeminiAi"
import { JobsRunning } from "~/scripts/types/ocr/JobsRunning"

export class AskGemini {
  geminiAi: GeminiAi = new GeminiAi()

  isProcessing: boolean = false
  jobId: string | null = null
  jobIds: string[] = []
  jobStatusInterval: any | null = null

  jobsRunning: JobsRunning | null = null

  minimumIntervalGap: number = 1000
  maximumIntervalGap: number = 30000
  intervalGap: number = 1000

  prompt: string = ""
  outcome: string[] = []

  constructor() {
    this.resetValues()
  }

  resetValues() {
    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []
    this.isProcessing = false
    this.intervalGap = this.minimumIntervalGap
    this.stopPollingJobStatus()
  }

  setPrompt(prompt: string): void {
    this.prompt = prompt
  }

  async run(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.prompt)) {
      return
    }

    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []
    this.isProcessing = true
    this.intervalGap = this.minimumIntervalGap

    try {
      let aiResponse = await this.geminiAi.askGemini(this.prompt)
      if (aiResponse.success) {
        this.jobIds.push(aiResponse.jobId)

        await this.fetchJobStatus()
        this.startPollingJobStatus()

        this.jobsRunning = new JobsRunning(this.jobIds, this.prompt)
      } else {
        this.isProcessing = false
        throw aiResponse.message
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.title = "Our AI is having some troubles to process your prompt."
        errorMessage.message = "If the issue persists, please let us know."
        errorMessage.handle()
      }
    }
  }

  async fetchJobStatus(): Promise<void> {
    if (this.jobIds.length <= 0 || !this.isProcessing) {
      this.stopPollingJobStatus()
      return
    }

    for (const jobId of this.jobIds) {
      const jobStatus = this.geminiAi.jobStatuses.find((js: GeminiAiJobStatusResponse) => {
        return js.jobId === jobId
      })

      if (jobStatus && !jobStatus.isPending()) {
        continue
      }

      await this.geminiAi.fetchJobStatus(jobId)
    }

    let isCompleted = this.geminiAi.jobStatuses.every((js: GeminiAiJobStatusResponse) => {
      return !js.isPending()
    })

    if (isCompleted) {
      //this.processData() --> Need them to tell us what data type? Or display all possibilities?
      this.isProcessing = false
    }
  }

  startPollingJobStatus(): void {
    this.stopPollingJobStatus()
    this.jobStatusInterval = setInterval(() => {
      this.fetchJobStatus()
    }, this.intervalGap)
  }

  stopPollingJobStatus(): void {
    if (!this.jobStatusInterval) {
      return
    }

    clearInterval(this.jobStatusInterval)
    this.jobStatusInterval = null
  }

  processResult(): void {
    const jobStatuses = this.geminiAi.jobStatuses.filter((js) => {
      return js.status === StatusConstants.COMPLETED
    })

    jobStatuses.forEach((js: GeminiAiJobStatusResponse) => {
      const regex = /```([\s\S]*?)```/
      const matchedData = js.result.match(regex)

      if (!matchedData || !matchedData[0]) {
        this.outcome.push(js.result)
        return
      }

      let info = matchedData[1].trim()
      info = info.replace("json", "")

      this.outcome.push(info)
    })
  }
}
