import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingCeoRevocation } from "~/scripts/models/CompanyConstitutionSettingCeoRevocation"

export const useCompanyConstitutionSettingCeoRevocationStore = defineStore("companyConstitutionSettingCeoRevocation", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingCeoRevocations = ref<CompanyConstitutionSettingCeoRevocation[]>([])
  const companyConstitutionSettingCeoRevocation = ref<CompanyConstitutionSettingCeoRevocation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingCeoRevocations, {
    items: companyConstitutionSettingCeoRevocations,
    item: companyConstitutionSettingCeoRevocation,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingCeoRevocations = computed(() => companyConstitutionSettingCeoRevocations.value.length)

  return {
    companyConstitutionSettingCeoRevocations,
    companyConstitutionSettingCeoRevocation,
    isLoading,
    error,
    totalCompanyConstitutionSettingCeoRevocations,
    ...crudActions
  }
})
