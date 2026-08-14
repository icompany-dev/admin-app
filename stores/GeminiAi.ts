import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { GeminiAiJobResponse } from "~/scripts/models/GeminiAiJobResponse"
import { GeminiAiJobStatusResponse } from "~/scripts/models/GeminiAiJobStatusResponse"

export const useGeminiAiStore = defineStore("geminiAi", () => {
  const { $repositories } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function generateFromText(prompt: string): Promise<GeminiAiJobResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAi.generateFromText(prompt)
      return new GeminiAiJobResponse(response)
    } catch (e: any) {
      error.value = e.message || `Failed to generate AI job from text`
      console.error(`Error to generate AI job from text`, e)
      return new GeminiAiJobResponse()
    } finally {
      isLoading.value = false
    }
  }

  async function generateFromImage(
    prompt: string,
    base64Image: string,
    mimeType: string,
    filename: string
  ): Promise<GeminiAiJobResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAi.generateFromImage(prompt, base64Image, mimeType, filename)
      return new GeminiAiJobResponse(response)
    } catch (e: any) {
      error.value = e.message || `Failed to generate AI job from text`
      console.error(`Error to generate AI job from text`, e)
      return new GeminiAiJobResponse()
    } finally {
      isLoading.value = false
    }
  }

  async function generateFromPdf(prompt: string, fileUrl: string, filename: string): Promise<GeminiAiJobResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAi.generateFromPdf(prompt, fileUrl, filename)
      return new GeminiAiJobResponse(response)
    } catch (e: any) {
      error.value = e.message || `Failed to generate AI job from text`
      console.error(`Error to generate AI job from text`, e)
      return new GeminiAiJobResponse()
    } finally {
      isLoading.value = false
    }
  }

  async function getJobStatus(jobId: string): Promise<GeminiAiJobStatusResponse> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAi.getJobStatus(jobId)
      return new GeminiAiJobStatusResponse(response)
    } catch (e: any) {
      error.value = e.message || `Failed to generate AI job from text`
      console.error(`Error to generate AI job from text`, e)
      return new GeminiAiJobStatusResponse()
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    generateFromText,
    generateFromImage,
    generateFromPdf,
    getJobStatus,
  }
})
