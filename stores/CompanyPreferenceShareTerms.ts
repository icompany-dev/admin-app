import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPreferenceShareTerm } from "~/scripts/models/CompanyPreferenceShareTerm"

export const useCompanyPreferenceShareTermStore = defineStore("companyPreferenceShareTerm", () => {
  const { $repositories } = useNuxtApp()

  const companyPreferenceShareTerms = ref<CompanyPreferenceShareTerm[]>([])
  const companyPreferenceShareTerm = ref<CompanyPreferenceShareTerm | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPreferenceShareTerms, {
    items: companyPreferenceShareTerms,
    item: companyPreferenceShareTerm,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyPreferenceShareTerms = computed(() => companyPreferenceShareTerms.value.length)

  return {
    companyPreferenceShareTerms,
    companyPreferenceShareTerm,
    isLoading,
    error,
    totalCompanyPreferenceShareTerms,
    ...crudActions
  }
})
