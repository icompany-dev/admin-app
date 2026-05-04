import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingWindingUp } from "~/scripts/models/CompanyConstitutionSettingWindingUp"

export const useCompanyConstitutionSettingWindingUpStore = defineStore("companyConstitutionSettingWindingUp", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingWindingUps = ref<CompanyConstitutionSettingWindingUp[]>([])
  const companyConstitutionSettingWindingUp = ref<CompanyConstitutionSettingWindingUp | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingWindingUps, {
    items: companyConstitutionSettingWindingUps,
    item: companyConstitutionSettingWindingUp,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingWindingUps = computed(() => companyConstitutionSettingWindingUps.value.length)

  return {
    companyConstitutionSettingWindingUps,
    companyConstitutionSettingWindingUp,
    isLoading,
    error,
    totalCompanyConstitutionSettingWindingUps,
    ...crudActions
  }
})
