import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPreferenceShareTermChecklist } from "~/scripts/models/CompanyPreferenceShareTermChecklist"

export const useCompanyPreferenceShareTermChecklistStore = defineStore("companyPreferenceShareTermChecklist", () => {
  const { $repositories } = useNuxtApp()

  const companyPreferenceShareTermChecklists = ref<CompanyPreferenceShareTermChecklist[]>([])
  const companyPreferenceShareTermChecklist = ref<CompanyPreferenceShareTermChecklist | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPreferenceShareTermChecklists, {
    items: companyPreferenceShareTermChecklists,
    item: companyPreferenceShareTermChecklist,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyPreferenceShareTermChecklists = computed(() => companyPreferenceShareTermChecklists.value.length)

  return {
    companyPreferenceShareTermChecklists,
    companyPreferenceShareTermChecklist,
    isLoading,
    error,
    totalCompanyPreferenceShareTermChecklists,
    ...crudActions
  }
})
