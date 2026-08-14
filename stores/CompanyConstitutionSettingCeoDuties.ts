import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingCeoDuty } from "~/scripts/models/CompanyConstitutionSettingCeoDuty"

export const useCompanyConstitutionSettingCeoDutyStore = defineStore("companyConstitutionSettingCeoDuty", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingCeoDuties = ref<CompanyConstitutionSettingCeoDuty[]>([])
  const companyConstitutionSettingCeoDuty = ref<CompanyConstitutionSettingCeoDuty | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingCeoDuties, {
    items: companyConstitutionSettingCeoDuties,
    item: companyConstitutionSettingCeoDuty,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingCeoDuties = computed(() => companyConstitutionSettingCeoDuties.value.length)

  return {
    companyConstitutionSettingCeoDuties,
    companyConstitutionSettingCeoDuty,
    isLoading,
    error,
    totalCompanyConstitutionSettingCeoDuties,
    ...crudActions
  }
})
