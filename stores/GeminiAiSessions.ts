import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { GeminiAiSession } from "~/scripts/models/GeminiAiSession"
import { GeminiAiSessionJob } from "~/scripts/models/GeminiAiSessionJob"

export const useGeminiAiSessionStore = defineStore("geminiAiSession", () => {
  const { $repositories } = useNuxtApp()

  const geminiAiSessions = ref<GeminiAiSession[]>([])
  const geminiAiSession = ref<GeminiAiSession | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.geminiAiSessions, {
    items: geminiAiSessions,
    item: geminiAiSession,
    isLoading: isLoading,
    error: error,
  })

  async function fetchOngoing(target: string, targetId: string): Promise<GeminiAiSession | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.fetchOngoing(target, targetId)
      return response.data ? new GeminiAiSession(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing session`
      console.error(`Error to fetch ongoing session`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchJob(id: string): Promise<GeminiAiSessionJob | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.fetchJob(id)
      return response.data ? new GeminiAiSessionJob(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch job: ${id}`
      console.error(`Error to fetch job: ${id}`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addJob(id: string, data: object): Promise<GeminiAiSessionJob | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.addJob(id, data)
      return response.data ? new GeminiAiSessionJob(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch job: ${id}`
      console.error(`Error to fetch job: ${id}`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addClassifiedJob(id: string, data: object): Promise<GeminiAiSessionJob | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.addClassifiedJob(id, data)
      return response.data ? new GeminiAiSessionJob(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch job: ${id}`
      console.error(`Error to fetch job: ${id}`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function removeJob(id: string, jobId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.removeJob(id, jobId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch job: ${id}`
      console.error(`Error to fetch job: ${id}`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function markCompleted(id: string): Promise<GeminiAiSession | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.geminiAiSessions.markCompleted(id)
      return response.data ? new GeminiAiSession(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch job: ${id}`
      console.error(`Error to fetch job: ${id}`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalSessions = computed(() => geminiAiSessions.value.length)

  return {
    geminiAiSessions,
    geminiAiSession,
    isLoading,
    error,
    totalSessions,
    ...crudActions,
    fetchOngoing,
    fetchJob,
    addJob,
    addClassifiedJob,
    removeJob,
    markCompleted,
  }
})
