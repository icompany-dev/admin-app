import { defineStore } from "pinia"
import type { CompanyAnnualReturn } from "~/scripts/models/CompanyAnnualReturn"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyAnnualReturnStore = defineStore("companyAnnualReturn", () => {
  const { $repositories } = useNuxtApp()

  const companyAnnualReturns = ref<CompanyAnnualReturn[]>([])
  const companyAnnualReturn = ref<CompanyAnnualReturn | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAnnualReturns, {
    items: companyAnnualReturns,
    item: companyAnnualReturn,
    isLoading: isLoading,
    error: error,
  })

  async function fetchDues(companyId: string): Promise<any> {
    try {
      isLoading.value = true
      error.value = null

      const response = await $repositories.companyAnnualReturns.fetchDues(companyId)
      let responseData = response.data
      if (!responseData || !responseData.years_due) {
        return []
      }

      return Array.isArray(responseData.years_due) ? responseData.years_due : Object.values(responseData.years_due)
    } catch (err: any) {
      error.value = err.message || "An error occurred while fetching dues."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAnnualReturns = computed(() => companyAnnualReturns.value.length)

  return {
    companyAnnualReturns,
    companyAnnualReturn,
    isLoading,
    error,
    totalCompanyAnnualReturns,
    ...crudActions,
    fetchDues,
  }
})
