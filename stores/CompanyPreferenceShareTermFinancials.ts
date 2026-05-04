import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPreferenceShareTermFinancial } from "~/scripts/models/CompanyPreferenceShareTermFinancial"

export const useCompanyPreferenceShareTermFinancialStore = defineStore("companyPreferenceShareTermFinancial", () => {
  const { $repositories } = useNuxtApp()

  const companyPreferenceShareTermFinancials = ref<CompanyPreferenceShareTermFinancial[]>([])
  const companyPreferenceShareTermFinancial = ref<CompanyPreferenceShareTermFinancial | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPreferenceShareTermFinancials, {
    items: companyPreferenceShareTermFinancials,
    item: companyPreferenceShareTermFinancial,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyPreferenceShareTermFinancials = computed(() => companyPreferenceShareTermFinancials.value.length)

  return {
    companyPreferenceShareTermFinancials,
    companyPreferenceShareTermFinancial,
    isLoading,
    error,
    totalCompanyPreferenceShareTermFinancials,
    ...crudActions
  }
})
