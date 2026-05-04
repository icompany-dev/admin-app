import { GeminiAi } from "./GeminiAi"
import type { GeminiAiJobStatusResponse } from "~/scripts/models/GeminiAiJobStatusResponse"
import { GeminiAiSessionJob } from "~/scripts/models/GeminiAiSessionJob"
import { JobsRunning } from "~/scripts/types/ocr/JobsRunning"
import { PdfError } from "~/scripts/types/ocr/PdfError"
import _ from "lodash"
import { Error } from "~/scripts/library/Error"
import { File as UploadedFile } from "~/scripts/models/File"
import { FileTypes } from "~/scripts/constants/FileTypes"
import * as pdfjsLib from "pdfjs-dist"
import { OcrPrompt } from "~/scripts/constants/OcrPrompts"
import { StatusConstants } from "~/scripts/constants/Status"
import { OcrDataProcessor } from "~/scripts/library/OcrDataProcessor"
import { OcrData } from "~/scripts/types/ocr/OcrData"
import { JobOcrData } from "~/scripts/types/ocr/JobOcrData"
import { GeminiAiSession, GeminiAiSessionTarget } from "../models/GeminiAiSession"
import { StringUtil } from "../utils/String"

export class Ocr {
  target: string = ""
  targetId: string = ""

  geminiAi: GeminiAi = new GeminiAi()

  documentCategory: string = ""

  file: File | null = null
  pdfFileUrl: string | null = null
  base64Image: string | null = null
  uploadedFileId: string | null = null
  numPages: number = 0
  fileUploadError: string | null = null
  isFileLoading: boolean = false

  isProcessing: boolean = false
  totalPages: number = 0
  totalUploaded: number = 0
  jobId: string | null = null
  jobIds: string[] = []
  jobStatusInterval: any | null = null

  jobsRunning: JobsRunning | null = null

  minimumIntervalGap: number = 1000
  maximumIntervalGap: number = 30000
  intervalGap: number = 1000

  //Processor
  selectedDocumentType: string | null = null
  ocrDataProcessor: OcrDataProcessor = new OcrDataProcessor()
  processedOcrData: OcrData | null = null
  processedOcrDataByJobs: JobOcrData[] = []

  geminiAiSessionJob: GeminiAiSessionJob = new GeminiAiSessionJob()
  canChangeFile: boolean = false

  language = useLanguage()
  fileRepository = useFileStore()
  geminiAiSessionRepository = useGeminiAiSessionStore()

  geminiAiSession: GeminiAiSession = new GeminiAiSession()

  constructor() {
    this.resetValues()
  }

  resetValues() {
    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []
    this.isProcessing = false
    this.totalUploaded = 0
    this.totalPages = 0
    this.intervalGap = this.minimumIntervalGap
    this.stopPollingJobStatus()
  }

  async processFile(file: File): Promise<void> {
    if (this.isFileLoading) {
      return
    }

    this.isFileLoading = true
    this.file = file

    if (this.isImageFile()) {
      this.base64Image = await this.geminiAi.fileToBase64(this.file)
    } else {
      this.pdfFileUrl = await this.geminiAi.fileToBase64(this.file)
      this.pdfFileUrl = `data:application/pdf;base64,${this.pdfFileUrl}`
    }

    this.isFileLoading = false
  }

  handlePdfError(err: PdfError): void {
    if (err && err.message && err.message.includes("Missing PDF")) {
      this.fileUploadError = this.language.isMalay()
        ? "Fail yang dipilih bukan fail PDF yang sah atau telah rosak."
        : "The selected file is not a valid PDF or is corrupted."
    } else if (err && err.name === "InvalidPDFException") {
      this.fileUploadError = this.language.isMalay()
        ? "Fail yang dipilih kelihatan rosak atau berbentuk tidak sempurna."
        : "The selected file appears to be corrupted or malformed."
    } else {
      this.fileUploadError = this.language.isMalay()
        ? "Gagal memaparkan PDF. Ia mungkin rosak atau tidak disokong."
        : "Failed to render PDF. It might be corrupted or unsupported."
    }
  }

  async uploadPdfFileToAws(): Promise<UploadedFile | null> {
    if (!this.file) {
      return null
    }

    try {
      const fileToUpload = this.file
      const formData = new FormData()
      const type = fileToUpload.type
      const name = _.truncate(fileToUpload.name, { length: 40 })
      formData.append("attachment", fileToUpload)
      formData.append("type", type)
      formData.append("name", name)

      let response = await this.fileRepository.uploadFile(formData)
      if (this.fileRepository.error) {
        throw this.fileRepository.error
      }

      return response
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForUploadFileToAws()
        errorMessage.handle()
      }

      return null
    }
  }

  async run(): Promise<void> {
    if (!this.file || this.file === null) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForNoFileToUpload()
      errorMessage.handle()

      return
    }

    this.jobIds = []
    this.geminiAi.jobStatuses = []
    this.geminiAi.aiResponses = []
    this.isProcessing = true
    this.totalUploaded = 0
    this.totalPages = 0
    this.intervalGap = this.minimumIntervalGap
    this.uploadedFileId = null

    let fileData: string | null = null

    if (this.file.type === FileTypes.PDF) {
      fileData = await this.processPdfFile()
    } else {
      fileData = await this.processImageFile()
    }

    this.jobsRunning = new JobsRunning(this.jobIds, fileData)
  }

  async processPdfFile(): Promise<string | null> {
    if (!this.pdfFileUrl) {
      return null
    }

    const uploadedFile: UploadedFile | null = await this.uploadPdfFileToAws()
    if (!uploadedFile) {
      return null
    }

    let fileData = uploadedFile.id
    this.uploadedFileId = uploadedFile.id

    const loadingTask = pdfjsLib.getDocument(this.pdfFileUrl)
    const pdf = await loadingTask.promise

    const rawFilename = uploadedFile.name.replace(".pdf", "").replace(".PDF", "")
    const filename = `${rawFilename}.pdf`
    const prompt = OcrPrompt.byDocumentCategory(this.documentCategory, "pdf")
    try {
      let aiResponse = await this.geminiAi.runOcrFromPdf(uploadedFile, prompt, filename)
      if (aiResponse.success) {
        this.totalUploaded += 1
        this.jobIds.push(aiResponse.jobId)
      } else {
        this.isProcessing = false
        throw aiResponse.message
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFileforOCR()
        errorMessage.handle()
      }
    }

    // const numPages = pdf.numPages
    // this.totalPages = Math.ceil(numPages / 5)
    // this.totalUploaded = 0
    // this.intervalGap = Math.min(numPages * this.minimumIntervalGap, this.maximumIntervalGap)
    // for (let i = 1; i <= numPages; i = i + 5) {
    //   const isLastPage = i === numPages
    //   const toPage = Math.min(i + 4, numPages)
    //   const prompt = OcrPrompt.byDocumentCategory(this.documentCategory, "pdf")

    //   const rawFilename = uploadedFile.name.replace(".pdf", "").replace(".PDF", "")
    //   const filename = `${rawFilename}-page${i}-${toPage}.pdf`
    //   try {
    //     let aiResponse = await this.geminiAi.runOcrFromPdf(uploadedFile, prompt, filename)
    //     if (aiResponse.success) {
    //       this.totalUploaded += 1
    //       this.jobIds.push(aiResponse.jobId)
    //     } else {
    //       this.isProcessing = false
    //       throw aiResponse.message
    //     }
    //   } catch (e: any) {
    //     if (e instanceof Error) {
    //       e.handle()
    //     } else {
    //       console.error("fail to process pdf for ocr", e)
    //       let error = new Error(Error.ERROR_TYPE_API, "Failed to process PDF file for OCR")
    //       error.handle()
    //     }
    //   }
    // }

    await this.fetchJobStatus()
    this.startPollingJobStatus()

    return fileData
  }

  async processImageFile(): Promise<string | null> {
    if (!this.base64Image || !this.file) {
      return null
    }

    let fileData = this.base64Image

    const prompt = OcrPrompt.byDocumentCategory("", "image")
    this.totalPages = 1
    try {
      let aiResponse = await this.geminiAi.runOcrFromImage(this.file, prompt)
      if (aiResponse.success) {
        this.totalUploaded = 1
        this.jobIds.push(aiResponse.jobId)

        await this.fetchJobStatus()
        this.startPollingJobStatus()
      } else {
        this.isProcessing = false
        throw aiResponse.message
      }
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFileforOCR()
        errorMessage.handle()
      }
    }

    return fileData
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

  processData(): void {
    if (!this.selectedDocumentType) {
      return
    }

    const jobStatuses = this.geminiAi.jobStatuses.filter((js) => {
      return js.status === StatusConstants.COMPLETED
    })

    this.processedOcrData = this.ocrDataProcessor.processData(jobStatuses, this.selectedDocumentType)
    this.processedOcrDataByJobs = []
    this.geminiAi.jobStatuses
      .filter((js) => {
        return js.status === StatusConstants.COMPLETED
      })
      .forEach((js: GeminiAiJobStatusResponse) => {
        if (!this.selectedDocumentType) {
          return
        }

        let ocrData = this.ocrDataProcessor.processData(js, this.selectedDocumentType)
        if (!ocrData) {
          return
        }
        this.processedOcrDataByJobs.push(new JobOcrData(js.jobId, ocrData))
      })
  }

  getProcessedOcrData(): JobOcrData[] {
    return this.processedOcrDataByJobs
  }

  isImageFile(): boolean {
    return this.file !== null && this.file.type !== "application/pdf"
  }

  totalToProcess(): number {
    return this.totalPages + this.jobIds.length
  }

  totalCompleted(): number {
    return (
      this.totalUploaded +
      this.geminiAi.jobStatuses.filter((js) => {
        return !js.isPending()
      }).length
    )
  }

  progressValue(): number {
    if (this.totalToProcess() <= 0) {
      return 0
    }

    return Math.ceil((this.totalCompleted() / this.totalToProcess()) * 100)
  }

  // Save session
  async saveGeminiAiSession(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.target) || StringUtil.isNullOrEmpty(this.targetId)) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.geminiAiSession.id)) {
      let responseOngoing = await this.geminiAiSessionRepository.fetchOngoing(this.target, this.targetId)
      if (responseOngoing !== null) {
        this.geminiAiSession = new GeminiAiSession(responseOngoing)
      } else {
        this.geminiAiSession.target = new GeminiAiSessionTarget()
        this.geminiAiSession.target.type = this.target
        this.geminiAiSession.target.id = this.targetId
        await this.geminiAiSession.create(this.geminiAiSessionRepository)
      }
    }

    // Add job
    let newGeminiAiSessionJob: GeminiAiSessionJob = new GeminiAiSessionJob()
    newGeminiAiSessionJob.sessionId = this.geminiAiSession.id
    newGeminiAiSessionJob.documentType = this.selectedDocumentType ?? "others"
    newGeminiAiSessionJob.fileUuid = this.uploadedFileId
    newGeminiAiSessionJob.fileData = this.isImageFile() ? this.base64Image : this.uploadedFileId

    this.jobIds.forEach((jobId: string) => {
      let geminiAiSessionJob: GeminiAiSessionJob = new GeminiAiSessionJob(newGeminiAiSessionJob)
      geminiAiSessionJob.jobId = jobId
      geminiAiSessionJob.create(this.geminiAiSessionRepository)
    })
  }
}
