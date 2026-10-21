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

  const totalCompanyFinancialStatements = computed(() => companyFinancialStatements.value.length)

  return {
    companyFinancialStatements,
    companyFinancialStatement,
    isLoading,
    error,
    totalCompanyFinancialStatements,
    ...crudActions
  }
})
