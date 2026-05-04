import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { Model } from "~/scripts/models/Model"

export const useWiseAiStore = defineStore("wiseAi", () => {
  const { $repositories } = useNuxtApp()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getToken(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.wiseAi.getToken()
      return response
    } catch (e: any) {
      error.value = e.message || "Failed to get Wise Ai token"
      console.error(`Fail to get Wise Ai token`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getToken,
  }
})
