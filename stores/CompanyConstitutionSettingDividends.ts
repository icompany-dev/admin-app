import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingDividend } from "~/scripts/models/CompanyConstitutionSettingDividend"

export const useCompanyConstitutionSettingDividendStore = defineStore("companyConstitutionSettingDividend", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingDividends = ref<CompanyConstitutionSettingDividend[]>([])
  const companyConstitutionSettingDividend = ref<CompanyConstitutionSettingDividend | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingDividends, {
    items: companyConstitutionSettingDividends,
    item: companyConstitutionSettingDividend,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingDividends = computed(() => companyConstitutionSettingDividends.value.length)

  return {
    companyConstitutionSettingDividends,
    companyConstitutionSettingDividend,
    isLoading,
    error,
    totalCompanyConstitutionSettingDividends,
    ...crudActions
  }
})
