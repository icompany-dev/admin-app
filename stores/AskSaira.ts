import { defineStore } from "pinia"
import { useNuxtApp } from "#app"

export const useAskSairaStore = defineStore("askSaira", () => {
  const { $repositories } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function runNameReservationWorkflow(inputAsText: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.askSaira.runNameReservationWorkflow(inputAsText)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to get result from open ai`
      console.error(`Error to get result from open ai`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    runNameReservationWorkflow,
  }
})
