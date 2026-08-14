import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyLoanApplication } from "~/scripts/models/CompanyLoanApplication"
import { Filter } from "~/scripts/library/Filter"
import { ApiRecord } from "~/scripts/library/ApiRecord"

export const useCompanyLoanApplicationStore = defineStore("companyLoanApplication", () => {
  const { $repositories } = useNuxtApp()

  const companyLoanApplications = ref<CompanyLoanApplication[]>([])
  const companyLoanApplication = ref<CompanyLoanApplication | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyLoanApplications, {
    items: companyLoanApplications,
    item: companyLoanApplication,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllForLoan(loanProvider: string, filter: Filter): Promise<ApiRecord<CompanyLoanApplication>> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyLoanApplications.fetchAllForLoan(loanProvider, filter)
      return response
    } catch (e) {
      error.value = ``
      return new ApiRecord<CompanyLoanApplication>({}, CompanyLoanApplication)
    } finally {
      isLoading.value = false
    }
  }

  async function ongoingLoanApplication(companyId: string, loanProvider: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyLoanApplications.ongoingLoanApplication(companyId, loanProvider)
      return response
    } catch (e) {
      error.value = ``
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function completedLoanApplication(companyId: string, loanProvider: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyLoanApplications.completedLoanApplication(companyId, loanProvider)
      return response
    } catch (e) {
      error.value = ``
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyLoanApplications = computed(() => companyLoanApplications.value.length)

  return {
    companyLoanApplications,
    companyLoanApplication,
    isLoading,
    error,
    totalCompanyLoanApplications,
    ...crudActions,
    fetchAllForLoan,
    ongoingLoanApplication,
    completedLoanApplication,
  }
})
