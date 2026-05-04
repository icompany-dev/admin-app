import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingRevocation } from "~/scripts/models/CompanyConstitutionSettingRevocation"

export const useCompanyConstitutionSettingRevocationStore = defineStore("companyConstitutionSettingRevocation", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingRevocations = ref<CompanyConstitutionSettingRevocation[]>([])
  const companyConstitutionSettingRevocation = ref<CompanyConstitutionSettingRevocation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingRevocations, {
    items: companyConstitutionSettingRevocations,
    item: companyConstitutionSettingRevocation,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingRevocations = computed(() => companyConstitutionSettingRevocations.value.length)

  return {
    companyConstitutionSettingRevocations,
    companyConstitutionSettingRevocation,
    isLoading,
    error,
    totalCompanyConstitutionSettingRevocations,
    ...crudActions
  }
})
