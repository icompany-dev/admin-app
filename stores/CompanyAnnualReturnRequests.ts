import { defineStore } from "pinia"
import type { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyAnnualReturnRequestStore = defineStore("companyAnnualReturnRequest", () => {
  const { $repositories } = useNuxtApp()

  const companyAnnualReturnRequests = ref<CompanyAnnualReturnRequest[]>([])
  const companyAnnualReturnRequest = ref<CompanyAnnualReturnRequest | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAnnualReturnRequests, {
    items: companyAnnualReturnRequests,
    item: companyAnnualReturnRequest,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAnnualReturnRequests = computed(() => companyAnnualReturnRequests.value.length)

  return {
    companyAnnualReturnRequests,
    companyAnnualReturnRequest,
    isLoading,
    error,
    totalCompanyAnnualReturnRequests,
    ...crudActions,
  }
})
