import { useNuxtApp } from "#app"
import { defineStore } from "pinia"
import { ChatbotMessage } from "~/scripts/types/ChatbotMessage"

export const useOpenAiStore = defineStore("openAi", () => {
  const { $externalApis } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function createThread(): Promise<string | null> {
    isLoading.value = true
    error.value = null

    try {
      const thread = await $externalApis.openAi.createThread()
      return thread.id
    } catch (e: any) {
      error.value = e.message || `Failed to create saira thread`
      console.error(`Error to create saira thread id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function runThread(threadId: string): Promise<string | null> {
    isLoading.value = true
    error.value = null

    try {
      const result = await $externalApis.openAi.runThread(threadId)
      return result.id
    } catch (e: any) {
      error.value = e.message || `Failed to create saira thread`
      console.error(`Error to create saira thread id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function getRunStatus(threadId: string, runId: string): Promise<string | null> {
    isLoading.value = true
    error.value = null

    try {
      const runResult = await $externalApis.openAi.getRunStatus(threadId, runId)
      return runResult.status
    } catch (e: any) {
      error.value = e.message || 'Failed to get saira run status'
      console.error('Error to get saira run status', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addMessage(threadId: string, data: ChatbotMessage): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await $externalApis.openAi.addMessage(threadId, data)
    } catch (e: any) {
      error.value = e.message || `Failed to update saira message`
      console.error(`Error to update saira message`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function getMessages(threadId: string): Promise<ChatbotMessage[] | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $externalApis.openAi.getMessages(threadId)
      const messages = response.data.map((x: any) => {
        return new ChatbotMessage(x.role, x.content[0].text.value)
      })
      return messages
    } catch (e: any) {
      error.value = e.message || `Failed to create saira thread`
      console.error(`Error to create saira thread id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createThread,
    addMessage,
    getMessages,
    runThread,
    getRunStatus
  }
})