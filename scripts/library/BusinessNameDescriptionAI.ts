import { StatusConstants } from "../constants/Status"
import type { GeminiAiJobResponse } from "../models/GeminiAiJobResponse"
import type { GeminiAiJobStatusResponse } from "../models/GeminiAiJobStatusResponse"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { GeminiAi } from "./GeminiAi"

export class BusinessNameDescriptionAI {
  geminiAi: GeminiAi = new GeminiAi()

  proposedName: string = ""
  businessDescription: string = ""
  prompt: string = ""

  isProcessing: boolean = false
  jobIds: string[] = []
  jobStatusInterval: any | null = null

  intervalGap: number = 1000

  resultDescription: string | null = null

  constructor() {
    this.resetValues()
  }

  resetValues(): void {
    this.proposedName = ""
    this.businessDescription = ""
    this.resultDescription = null
    this.isProcessing = false
    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []
    this.stopPollingJobStatus()
  }

  formPrompt(): void {
    if (StringUtil.isNullOrEmpty(this.proposedName)) {
      this.prompt = ""
      return
    }

    this.prompt = `
      You are a Company Secretary in Malaysia. You have been working for 10 years. You are bounded by the 
      Companies Act 2016. You are knowledgable on incorporating new Sdn Bhd in Malaysia. 
      I want to incorporate a new Sdn Bhd. This is the name proposed: ${this.proposedName}.
      This is the description of my Business: ${this.businessDescription}. 
      Draft me a short description of my business name using less than 250 characters that will explain the 
      reason behind the name and why I want to use that name. This description will be submitted to SSM for the name reservation process.
      Your response must be in the following JSON format: { description: '' }
    `
  }

  async askGemini(proposedName: string, businesDescription: string): Promise<void> {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true
    this.proposedName = proposedName
    this.businessDescription = businesDescription
    this.formPrompt()

    if (StringUtil.isNullOrEmpty(this.prompt)) {
      let errorMessage: Error = new Error()
      errorMessage.setForIncompleteData()
      throw errorMessage
    }

    try {
      let aiResponse: GeminiAiJobResponse = await this.geminiAi.askGemini(this.prompt)
      if (aiResponse.success) {
        this.jobIds.push(aiResponse.jobId)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForAI()
        errorMessage.handle()
      }
    }

    await this.fetchJobStatus()
    this.startPollingJobStatus()
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
      this.processData()
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

  processData(): void {
    let completedJobs = this.geminiAi.jobStatuses.filter((js: GeminiAiJobStatusResponse) => {
      return js.status === StatusConstants.COMPLETED
    })

    if (completedJobs.length <= 0) {
      return
    }

    let completedJob = completedJobs[0] //Take first because we only run 1 job
    let result = completedJob.result
    const regex = /```json\s*([\s\S]*?)\s*```/
    const matchedData = result.match(regex)

    if (!matchedData || !matchedData[0]) {
      return
    }

    let info = matchedData[1].trim()
    info = info.replace("json", "")

    let object = JSON.parse(info)
    this.resultDescription = object.description ?? this.proposedName
  }
}
