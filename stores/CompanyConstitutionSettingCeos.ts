import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingCeo } from "~/scripts/models/CompanyConstitutionSettingCeo"

export const useCompanyConstitutionSettingCeoStore = defineStore("companyConstitutionSettingCeo", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingCeos = ref<CompanyConstitutionSettingCeo[]>([])
  const companyConstitutionSettingCeo = ref<CompanyConstitutionSettingCeo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingCeos, {
    items: companyConstitutionSettingCeos,
    item: companyConstitutionSettingCeo,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingCeos = computed(() => companyConstitutionSettingCeos.value.length)

  return {
    companyConstitutionSettingCeos,
    companyConstitutionSettingCeo,
    isLoading,
    error,
    totalCompanyConstitutionSettingCeos,
    ...crudActions
  }
})
