import { defineStore } from "pinia"
import { Bank } from "~/scripts/models/Bank"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import type { Filter } from "~/scripts/library/Filter"

export const useBankStore = defineStore("bank", () => {
  const { $repositories } = useNuxtApp()

  const banks = ref<Bank[]>([])
  const bank = ref<Bank | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.banks, {
    items: banks,
    item: bank,
    isLoading: isLoading,
    error: error,
  })

  const totalBanks = computed(() => banks.value.length)

  async function forCompany(filter: Filter): Promise<ApiRecord<Bank>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.banks.forCompany(filter)
      return new ApiRecord<Bank>(response, Bank)
    } catch (e: any) {
      error.value = e.message || "Failed to fetch banks for company."
      console.error(`Error fetching banks for company ${filter.companyId}:`, e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function hasOngoing(companyId: string, bankId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.banks.hasOngoing(companyId, bankId)
      return response.has_ongoing || false
    } catch (e: any) {
      error.value = e.message || "Failed to check for ongoing bank applications."
      console.error(`Error checking ongoing for company ${companyId} and bank ${bankId}:`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    banks,
    bank,
    isLoading,
    error,
    totalBanks,
    ...crudActions,
    forCompany,
    hasOngoing,
  }
})
