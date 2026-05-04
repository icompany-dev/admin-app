import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingPurposeOfCompany } from "~/scripts/models/CompanyConstitutionSettingPurposeOfCompany"

export const useCompanyConstitutionSettingPurposeOfCompanyStore = defineStore("companyConstitutionSettingPurposeOfCompany", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingPurposeOfCompanies = ref<CompanyConstitutionSettingPurposeOfCompany[]>([])
  const companyConstitutionSettingPurposeOfCompany = ref<CompanyConstitutionSettingPurposeOfCompany | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingPurposeOfCompanies, {
    items: companyConstitutionSettingPurposeOfCompanies,
    item: companyConstitutionSettingPurposeOfCompany,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingPurposeOfCompanies = computed(() => companyConstitutionSettingPurposeOfCompanies.value.length)

  return {
    companyConstitutionSettingPurposeOfCompanies,
    companyConstitutionSettingPurposeOfCompany,
    isLoading,
    error,
    totalCompanyConstitutionSettingPurposeOfCompanies,
    ...crudActions
  }
})
