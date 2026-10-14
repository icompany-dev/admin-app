import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"

export const useCompanyDirectorPaymentStore = defineStore("companyDirectorPayment", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorPayments = ref<CompanyDirectorPayment[]>([])
  const companyDirectorPayment = ref<CompanyDirectorPayment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorPayments, {
    items: companyDirectorPayments,
    item: companyDirectorPayment,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDirectorPayments = computed(() => companyDirectorPayments.value.length)

  return {
    companyDirectorPayments,
    companyDirectorPayment,
    isLoading,
    error,
    totalCompanyDirectorPayments,
    ...crudActions
  }
})
