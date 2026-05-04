import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingChairman } from "~/scripts/models/CompanyConstitutionSettingChairman"

export const useCompanyConstitutionSettingChairmanStore = defineStore("companyConstitutionSettingChairman", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingChairmans = ref<CompanyConstitutionSettingChairman[]>([])
  const companyConstitutionSettingChairman = ref<CompanyConstitutionSettingChairman | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingChairmans, {
    items: companyConstitutionSettingChairmans,
    item: companyConstitutionSettingChairman,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingChairmans = computed(() => companyConstitutionSettingChairmans.value.length)

  return {
    companyConstitutionSettingChairmans,
    companyConstitutionSettingChairman,
    isLoading,
    error,
    totalCompanyConstitutionSettingChairmans,
    ...crudActions
  }
})
