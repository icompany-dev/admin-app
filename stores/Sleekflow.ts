import { useNuxtApp } from '#app'
import { defineStore } from 'pinia'

export const useSleekflowStore = defineStore('sleekflow', () => {
  const { $externalApis } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchConversationsFor(phoneNumber: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response =
        await $externalApis.sleekflow.fetchConversationsFor(phoneNumber)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch directors for company`
      console.error(`Error to fetch directors by company id`, e)
    }
  }

  return {
    isLoading,
    error,
    fetchConversationsFor,
  }
})
