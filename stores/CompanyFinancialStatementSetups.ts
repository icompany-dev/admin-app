import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyFinancialStatementSetup } from "~/scripts/models/CompanyFinancialStatementSetup"

export const useCompanyFinancialStatementSetupStore = defineStore("companyFinancialStatementSetup", () => {
  const { $repositories } = useNuxtApp()

  const companyFinancialStatementSetups = ref<CompanyFinancialStatementSetup[]>([])
  const companyFinancialStatementSetup = ref<CompanyFinancialStatementSetup | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyFinancialStatementSetups, {
    items: companyFinancialStatementSetups,
    item: companyFinancialStatementSetup,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyFinancialStatementSetups = computed(() => companyFinancialStatementSetups.value.length)

  return {
    companyFinancialStatementSetups,
    companyFinancialStatementSetup,
    isLoading,
    error,
    totalCompanyFinancialStatementSetups,
    ...crudActions
  }
})
