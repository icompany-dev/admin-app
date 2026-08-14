import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingWrittenResolution } from "~/scripts/models/CompanyConstitutionSettingWrittenResolution"

export const useCompanyConstitutionSettingWrittenResolutionStore = defineStore(
  "companyConstitutionSettingWrittenResolution",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingWrittenResolutions = ref<CompanyConstitutionSettingWrittenResolution[]>([])
    const companyConstitutionSettingWrittenResolution = ref<CompanyConstitutionSettingWrittenResolution | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingWrittenResolutions, {
      items: companyConstitutionSettingWrittenResolutions,
      item: companyConstitutionSettingWrittenResolution,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingWrittenResolutions = computed(
      () => companyConstitutionSettingWrittenResolutions.value.length
    )

    return {
      companyConstitutionSettingWrittenResolutions,
      companyConstitutionSettingWrittenResolution,
      isLoading,
      error,
      totalCompanyConstitutionSettingWrittenResolutions,
      ...crudActions,
    }
  }
)
