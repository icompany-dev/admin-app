import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingWrittenDcr } from "~/scripts/models/CompanyConstitutionSettingWrittenDcr"

export const useCompanyConstitutionSettingWrittenDcrStore = defineStore("companyConstitutionSettingWrittenDcr", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingWrittenDcrs = ref<CompanyConstitutionSettingWrittenDcr[]>([])
  const companyConstitutionSettingWrittenDcr = ref<CompanyConstitutionSettingWrittenDcr | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingWrittenDcrs, {
    items: companyConstitutionSettingWrittenDcrs,
    item: companyConstitutionSettingWrittenDcr,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingWrittenDcrs = computed(() => companyConstitutionSettingWrittenDcrs.value.length)

  return {
    companyConstitutionSettingWrittenDcrs,
    companyConstitutionSettingWrittenDcr,
    isLoading,
    error,
    totalCompanyConstitutionSettingWrittenDcrs,
    ...crudActions
  }
})
