import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"

export const useCompanyDirectorLoanStore = defineStore("companyDirectorLoan", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorLoans = ref<CompanyDirectorLoan[]>([])
  const companyDirectorLoan = ref<CompanyDirectorLoan | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorLoans, {
    items: companyDirectorLoans,
    item: companyDirectorLoan,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDirectorLoans = computed(() => companyDirectorLoans.value.length)

  return {
    companyDirectorLoans,
    companyDirectorLoan,
    isLoading,
    error,
    totalCompanyDirectorLoans,
    ...crudActions
  }
})
