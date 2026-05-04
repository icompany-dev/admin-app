import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingEvidenceOfTitle } from "~/scripts/models/CompanyConstitutionSettingEvidenceOfTitle"

export const useCompanyConstitutionSettingEvidenceOfTitleStore = defineStore("companyConstitutionSettingEvidenceOfTitle", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingEvidenceOfTitles = ref<CompanyConstitutionSettingEvidenceOfTitle[]>([])
  const companyConstitutionSettingEvidenceOfTitle = ref<CompanyConstitutionSettingEvidenceOfTitle | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingEvidenceOfTitles, {
    items: companyConstitutionSettingEvidenceOfTitles,
    item: companyConstitutionSettingEvidenceOfTitle,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingEvidenceOfTitles = computed(() => companyConstitutionSettingEvidenceOfTitles.value.length)

  return {
    companyConstitutionSettingEvidenceOfTitles,
    companyConstitutionSettingEvidenceOfTitle,
    isLoading,
    error,
    totalCompanyConstitutionSettingEvidenceOfTitles,
    ...crudActions
  }
})
