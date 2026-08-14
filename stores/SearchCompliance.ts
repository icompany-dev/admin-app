import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { SearchCompliance } from "~/scripts/models/SearchCompliance"

export const useSearchComplianceStore = defineStore("searchCompliance", () => {
  const { $repositories } = useNuxtApp()
  const searchCompliance = ref<SearchCompliance | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function search(searchText: string): Promise<SearchCompliance | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.searchCompliance.search(searchText)
      return new SearchCompliance(response.data ?? null)
    } catch (e: any) {
      error.value = e.message || "Failed to fetch states for user"
      console.error(`Fail to fetch states for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchCompliance,
    isLoading,
    error,
    search,
  }
})
