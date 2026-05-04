import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPreferenceShareTermGovernance } from "~/scripts/models/CompanyPreferenceShareTermGovernance"

export const useCompanyPreferenceShareTermGovernanceStore = defineStore("companyPreferenceShareTermGovernance", () => {
  const { $repositories } = useNuxtApp()

  const companyPreferenceShareTermGovernances = ref<CompanyPreferenceShareTermGovernance[]>([])
  const companyPreferenceShareTermGovernance = ref<CompanyPreferenceShareTermGovernance | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPreferenceShareTermGovernances, {
    items: companyPreferenceShareTermGovernances,
    item: companyPreferenceShareTermGovernance,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyPreferenceShareTermGovernances = computed(() => companyPreferenceShareTermGovernances.value.length)

  return {
    companyPreferenceShareTermGovernances,
    companyPreferenceShareTermGovernance,
    isLoading,
    error,
    totalCompanyPreferenceShareTermGovernances,
    ...crudActions
  }
})
