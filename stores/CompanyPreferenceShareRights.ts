import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPreferenceShareRight } from "~/scripts/models/CompanyPreferenceShareRight"

export const useCompanyPreferenceShareRightStore = defineStore("companyPreferenceShareRight", () => {
  const { $repositories } = useNuxtApp()

  const companyPreferenceShareRights = ref<CompanyPreferenceShareRight[]>([])
  const companyPreferenceShareRight = ref<CompanyPreferenceShareRight | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPreferenceShareRights, {
    items: companyPreferenceShareRights,
    item: companyPreferenceShareRight,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyPreferenceShareRights = computed(() => companyPreferenceShareRights.value.length)

  return {
    companyPreferenceShareRights,
    companyPreferenceShareRight,
    isLoading,
    error,
    totalCompanyPreferenceShareRights,
    ...crudActions
  }
})
