import { useGeminiAiStore } from "~/stores/GeminiAi"
import { GeminiAiJobResponse } from "../models/GeminiAiJobResponse"
import { GeminiAiJobStatusResponse } from "../models/GeminiAiJobStatusResponse"
import { Error } from "./Error"
import { File as UploadedFile } from "../models/File"

export class GeminiAi {
  static FILE_TYPE_PDF = "application/pdf"

  geminiAi = useGeminiAiStore()

  aiResponses: GeminiAiJobResponse[] = []
  jobStatuses: GeminiAiJobStatusResponse[] = []

  constructor() {}

  async fetchJobStatus(jobId: string): Promise<void> {
    try {
      let existingJobStatus = this.jobStatuses.find((js: GeminiAiJobStatusResponse) => {
        return js.jobId === jobId
      })

      let response = await this.geminiAi.getJobStatus(jobId)
      if (this.geminiAi.error) {
        throw this.geminiAi.error
      }

      if (existingJobStatus) {
        existingJobStatus.convertFromResponse(response)
      } else {
        this.jobStatuses.push(response)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchCustom("AI Job Status", "Status Proses AI")
        errorMessage.handle()
      }
    }
  }

  async runOcrFromImage(imageFile: File, prompt: string): Promise<GeminiAiJobResponse> {
    prompt = prompt.replace(/\n/g, " ")
    let aiResponse = new GeminiAiJobResponse()

    try {
      let response = await this.generateFromImage(prompt, imageFile, imageFile.name)
      if (response) {
        aiResponse = new GeminiAiJobResponse(response)
        this.aiResponses.push(aiResponse)

        let newJobStatusResponse = new GeminiAiJobStatusResponse()
        newJobStatusResponse.jobId = aiResponse.jobId
        this.jobStatuses.push(newJobStatusResponse)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForAIJob()
        errorMessage.handle()
      }
    }

    return aiResponse
  }

  // File --> must be an object resulted from upload to our AWS S3
  async runOcrFromPdf(file: UploadedFile, prompt: string, filename: string): Promise<GeminiAiJobResponse> {
    prompt = prompt.replace(/\n/g, " ")
    if (!file.url) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncorrectFileTypePdf()
      throw errorMessage
    }

    let aiResponse = new GeminiAiJobResponse()

    try {
      let response = await this.generateFromPdfFile(prompt, file.url, filename)
      if (response) {
        aiResponse = new GeminiAiJobResponse(response)
        this.aiResponses.push(aiResponse)

        let newJobStatusResponse = new GeminiAiJobStatusResponse()
        newJobStatusResponse.jobId = aiResponse.jobId
        this.jobStatuses.push(newJobStatusResponse)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForAIJob()
        errorMessage.handle()
      }
    }

    return aiResponse
  }

  async askGemini(prompt: string): Promise<GeminiAiJobResponse> {
    prompt = prompt.replace(/\n/g, " ")
    let aiResponse = new GeminiAiJobResponse()

    try {
      let response = await this.generateFromText(prompt)
      if (response) {
        aiResponse = new GeminiAiJobResponse(response)
        this.aiResponses.push(aiResponse)

        let newJobStatusResponse = new GeminiAiJobStatusResponse()
        newJobStatusResponse.jobId = aiResponse.jobId
        this.jobStatuses.push(newJobStatusResponse)
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForAIJob()
        errorMessage.handle()
      }
    }

    return aiResponse
  }

  // Private functions
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          resolve(result.split(",")[1])
        } else {
          reject(new Error(Error.ERROR_TYPE_DATA, "FileReader return result was not a string."))
        }
      }

      reader.onerror = (error) => {
        console.error("fileToBase64: Error reading file:", error)
        reject(error)
      }

      try {
        reader.readAsDataURL(file)
      } catch (e) {
        console.error("fileToBase64: Synchronous error calling readAsDataURL:", e)
        reject(e)
      }
    })
  }

  async generateFromText(prompt: string): Promise<GeminiAiJobResponse> {
    return await this.geminiAi.generateFromText(prompt)
  }

  async generateFromImage(prompt: string, imageFile: File, filename: string): Promise<GeminiAiJobResponse> {
    const mimeType = imageFile.type
    const base64Image = await this.fileToBase64(imageFile)

    return await this.geminiAi.generateFromImage(prompt, base64Image, mimeType, filename)
  }

  async generateFromPdfFile(prompt: string, fileUrl: string, filename: string): Promise<GeminiAiJobResponse> {
    return await this.geminiAi.generateFromPdf(prompt, fileUrl, filename)
  }
}
