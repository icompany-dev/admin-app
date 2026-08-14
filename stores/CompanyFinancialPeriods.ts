import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyFinancialPeriod } from "~/scripts/models/CompanyFinancialPeriod"

export const useCompanyFinancialPeriodStore = defineStore("companyFinancialPeriod", () => {
  const { $repositories } = useNuxtApp()

  const companyFinancialPeriods = ref<CompanyFinancialPeriod[]>([])
  const companyFinancialPeriod = ref<CompanyFinancialPeriod | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyFinancialPeriods, {
    items: companyFinancialPeriods,
    item: companyFinancialPeriod,
    isLoading: isLoading,
    error: error,
  })

  async function current(companyId: string): Promise<CompanyFinancialPeriod | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyFinancialPeriods.current(companyId)
      return new CompanyFinancialPeriod(response.data)
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function byDates(companyId: string, startDate: string, endDate: string): Promise<CompanyFinancialPeriod[]> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyFinancialPeriods.byDates(companyId, startDate, endDate)
      return response.data && Array.isArray(response.data)
        ? response.data.map((d: any) => {
            return new CompanyFinancialPeriod(d)
          })
        : []
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function hasSetFinancialYearEnd(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyFinancialPeriods.hasSetFinancialYearEnd(companyId)
      return response.has_set_financial_year_end ?? false
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyFinancialPeriods = computed(() => companyFinancialPeriods.value.length)

  return {
    companyFinancialPeriods,
    companyFinancialPeriod,
    isLoading,
    error,
    totalCompanyFinancialPeriods,
    ...crudActions,
    current,
    byDates,
    hasSetFinancialYearEnd,
  }
})
