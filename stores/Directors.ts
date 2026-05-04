import { defineStore } from "pinia"
import type { Director } from "~/scripts/models/Director"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useDirectorStore = defineStore("director", () => {
  const { $repositories } = useNuxtApp()

  const directors = ref<Director[]>([])
  const director = ref<Director | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.directors, {
    items: directors,
    item: director,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllForUserByCompany(companyId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response: Director = await $repositories.directors.fetchForUserByCompanyId(companyId)
      director.value = response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch directors for company`
      console.error(`Error to fetch directors by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllForCompany(companyId: string): Promise<Director[]> {
    isLoading.value = true
    error.value = null

    try {
      const response: Director[] = await $repositories.directors.fetchAllForCompany(companyId)
      directors.value = response
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch directors for company`
      console.error(`Error to fetch directors by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalDirectors = computed(() => directors.value.length)

  return {
    directors,
    director,
    isLoading,
    error,
    totalDirectors,
    ...crudActions,
    fetchAllForUserByCompany,
    fetchAllForCompany,
  }
})
