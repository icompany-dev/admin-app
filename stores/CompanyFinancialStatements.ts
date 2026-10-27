import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyFinancialStatement } from "~/scripts/models/CompanyFinancialStatement"

export const useCompanyFinancialStatementStore = defineStore("companyFinancialStatement", () => {
  const { $repositories } = useNuxtApp()

  const companyFinancialStatements = ref<CompanyFinancialStatement[]>([])
  const companyFinancialStatement = ref<CompanyFinancialStatement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyFinancialStatements, {
    items: companyFinancialStatements,
    item: companyFinancialStatement,
    isLoading: isLoading,
    error: error,
  })

  async function byFinancialPeriodId(financialPeriodId: string): Promise<CompanyFinancialStatement | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyFinancialStatements.byFinancialPeriodId(financialPeriodId)
      return new CompanyFinancialStatement(response.data)
    } catch (e: any) {
      console.error(`Error to get financial statement`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyFinancialStatements = computed(() => companyFinancialStatements.value.length)

  return {
    companyFinancialStatements,
    companyFinancialStatement,
    isLoading,
    error,
    totalCompanyFinancialStatements,
    ...crudActions,
    byFinancialPeriodId,
  }
})
