import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"

export const useCompanySetFinancialYearEndStore = defineStore("companySetFinancialYearEnd", () => {
  const { $repositories } = useNuxtApp()

  const companySetFinancialYearEnds = ref<CompanySetFinancialYearEnd[]>([])
  const companySetFinancialYearEnd = ref<CompanySetFinancialYearEnd | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companySetFinancialYearEnds, {
    items: companySetFinancialYearEnds,
    item: companySetFinancialYearEnd,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanySetFinancialYearEnds = computed(() => companySetFinancialYearEnds.value.length)

  return {
    companySetFinancialYearEnds,
    companySetFinancialYearEnd,
    isLoading,
    error,
    totalCompanySetFinancialYearEnds,
    ...crudActions,
  }
})
