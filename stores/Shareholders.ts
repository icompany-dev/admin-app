import { defineStore } from "pinia"
import type { Shareholder } from "~/scripts/models/Shareholder"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useShareholderStore = defineStore("shareholder", () => {
  const { $repositories } = useNuxtApp()

  const shareholders = ref<Shareholder[]>([])
  const shareholder = ref<Shareholder | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.shareholders, {
    items: shareholders,
    item: shareholder,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllForUserByCompany(companyId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response: Shareholder = await $repositories.shareholders.fetchForUserByCompanyId(companyId)
      shareholder.value = response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch shareholders for company`
      console.error(`Error to fetch shareholders by company id`, e)
    }
  }

  async function fetchAllForCompany(companyId: string): Promise<Shareholder[]> {
    isLoading.value = true
    error.value = null

    try {
      const response: Shareholder[] = await $repositories.shareholders.fetchAllForCompany(companyId)
      shareholders.value = response

      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch shareholders for company`
      console.error(`Error to fetch shareholders by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalShareholders = computed(() => shareholders.value.length)

  return {
    shareholders,
    shareholder,
    isLoading,
    error,
    totalShareholders,
    ...crudActions,
    fetchAllForUserByCompany,
    fetchAllForCompany,
  }
})
