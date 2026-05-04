import { useNuxtApp } from "#app"
import { defineStore } from "pinia"

export const useGoogleMapStore = defineStore("googleMap", () => {
  const { $externalApis } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCoordinates(address: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = $externalApis.googleMap.fetchCoordinates(address)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch directors for company`
      console.error(`Error to fetch directors by company id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    fetchCoordinates,
  }
})
