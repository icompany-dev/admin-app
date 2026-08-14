import StepThreeElectingShareholders from "~/components/Incorporations/StepThreeElectingShareholders.vue"
import { StatusConstants } from "../constants/Status"
import type { GeminiAiJobResponse } from "../models/GeminiAiJobResponse"
import type { GeminiAiJobStatusResponse } from "../models/GeminiAiJobStatusResponse"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { GeminiAi } from "./GeminiAi"
import { ChatbotMessage } from "../types/ChatbotMessage"
import { SearchConstants } from "../constants/Search"

export class CompanyNameCheckerAI {
  geminiAi: GeminiAi = new GeminiAi()

  openAi = useOpenAiStore()
  threadId: string | null = null
  runId: string | null = null

  companyName: string = ""
  prompt: string = ""

  isProcessing: boolean = false
  jobIds: string[] = []
  jobStatusInterval: any | null = null

  intervalGap: number = 1000

  isMatchFound: boolean = false
  resultMatchedNames: string[] = []
  resultRegistrationNumberNew: string | null = null
  resultRegistrationNumberOld: string | null = null

  constructor() {
    this.resetValues()
  }

  resetValues(): void {
    this.companyName = ""
    this.resultMatchedNames = []
    this.resultRegistrationNumberNew = null
    this.resultRegistrationNumberOld = null
    this.isMatchFound = false
    this.isProcessing = false
    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []

    this.threadId = null
  }

  formPrompt(): void {
    if (StringUtil.isNullOrEmpty(this.companyName)) {
      this.prompt = ""
      return
    }

    if (!StringUtil.contains(this.companyName.toLowerCase(), "sdn bhd")) {
      this.companyName = `${this.companyName} sdn bhd`
    }

    this.prompt = `
      Perform a search to find the official Malaysian company registration details for: "${this.companyName.toUpperCase()}".
      I specifically need:
      1. The exact registered company name (usually ending in SDN. BHD. or BERHAD).
      2. The NEW Registration Number (typically a 12-digit format, e.g., 201901000005).
      3. The OLD Registration Number (typically format XXXXXX-X, e.g., 123456-A).
      Analyze the search results carefully. If you find the company, extract these details.
      Return the answer strictly as a JSON object wrapped in a markdown code block.
      The JSON structure must be:
      \`\`\`json
      {
        "companyName": "String",
        "newRegistrationNumber": "String or null",
        "oldRegistrationNumber": "String or null",
      }
      \`\`\`
    `
    // this.prompt = this.prompt
    //   .replace(/\n/g, " ")
    //   .replace(/\s{2,}/g, " ")
    //   .trim()
  }

  async askOpenAi(newCompanyName: string): Promise<void> {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true
    this.companyName = newCompanyName
    this.formPrompt()

    if (StringUtil.isNullOrEmpty(this.prompt)) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncompleteData()
      throw errorMessage
    }

    try {
      if (this.threadId === null) {
        this.threadId = await this.openAi.createThread()
        if (!this.threadId) {
          throw this.openAi.error
        }
      }

      let data = new ChatbotMessage(SearchConstants.USER_ROLE_USER, this.prompt)
      await this.openAi.addMessage(this.threadId, data)

      if (this.openAi.error !== null) {
        throw this.openAi.error
      }

      this.runId = await this.openAi.runThread(this.threadId)
      if (!this.runId) {
        throw this.openAi.error
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForAI()
        errorMessage.handle()
      }
    }

    await this.checkOpenAiStatus()
    this.startPollingJobStatus()
  }

  async checkOpenAiStatus(): Promise<void> {
    if (!this.isProcessing || !this.threadId || !this.runId) {
      this.stopPollingJobStatus()
      return
    }

    let runStatus = await this.openAi.getRunStatus(this.threadId, this.runId)
    if (
      runStatus === SearchConstants.OPENAI_RUN_STATUS_QUEUED ||
      runStatus === SearchConstants.OPENAI_RUN_STATUS_IN_PROGRESS
    ) {
      return
    }

    let result = await this.openAi.getMessages(this.threadId)
    if (result !== null) {
      // do something
    }

    this.isProcessing = false
  }

  async askGemini(newCompanyName: string): Promise<void> {
    if (this.isProcessing) {
      return
    }

    this.isProcessing = true
    this.companyName = newCompanyName
    this.formPrompt()

    if (StringUtil.isNullOrEmpty(this.prompt)) {
      let errorMessage: Error = new Error("", "")
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
        let errorMessage: Error = new Error("", "")
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
      // this.checkOpenAiStatus()
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
    const regex = /```([\s\S]*?)```/
    const matchedData = result.match(regex)
    if (!matchedData || !matchedData[0]) {
      return
    }

    let info = matchedData[1].trim()
    info = info.replace("json", "")

    let object = JSON.parse(info)
    this.resultMatchedNames = [object.companyName ?? ""]
    this.resultRegistrationNumberNew = object.newRegistrationNumber ?? null
    this.resultRegistrationNumberOld = object.oldRegistrationNumber ?? null
  }
}
