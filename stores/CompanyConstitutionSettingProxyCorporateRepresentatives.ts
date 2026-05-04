import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingProxyCorporateRepresentative } from "~/scripts/models/CompanyConstitutionSettingProxyCorporateRepresentative"

export const useCompanyConstitutionSettingProxyCorporateRepresentativeStore = defineStore("companyConstitutionSettingProxyCorporateRepresentative", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingProxyCorporateRepresentatives = ref<CompanyConstitutionSettingProxyCorporateRepresentative[]>([])
  const companyConstitutionSettingProxyCorporateRepresentative = ref<CompanyConstitutionSettingProxyCorporateRepresentative | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingProxyCorporateRepresentatives, {
    items: companyConstitutionSettingProxyCorporateRepresentatives,
    item: companyConstitutionSettingProxyCorporateRepresentative,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingProxyCorporateRepresentatives = computed(() => companyConstitutionSettingProxyCorporateRepresentatives.value.length)

  return {
    companyConstitutionSettingProxyCorporateRepresentatives,
    companyConstitutionSettingProxyCorporateRepresentative,
    isLoading,
    error,
    totalCompanyConstitutionSettingProxyCorporateRepresentatives,
    ...crudActions
  }
})
