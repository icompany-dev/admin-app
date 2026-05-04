import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingTypesAndClassOfShare } from "~/scripts/models/CompanyConstitutionSettingTypesAndClassOfShare"

export const useCompanyConstitutionSettingTypesAndClassOfShareStore = defineStore(
  "companyConstitutionSettingTypesAndClassOfShare",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingTypesAndClassOfShares = ref<CompanyConstitutionSettingTypesAndClassOfShare[]>([])
    const companyConstitutionSettingTypesAndClassOfShare = ref<CompanyConstitutionSettingTypesAndClassOfShare | null>(
      null
    )
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingTypesAndClassOfShares, {
      items: companyConstitutionSettingTypesAndClassOfShares,
      item: companyConstitutionSettingTypesAndClassOfShare,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingTypesAndClassOfShares = computed(
      () => companyConstitutionSettingTypesAndClassOfShares.value.length
    )

    return {
      companyConstitutionSettingTypesAndClassOfShares,
      companyConstitutionSettingTypesAndClassOfShare,
      isLoading,
      error,
      totalCompanyConstitutionSettingTypesAndClassOfShares,
      ...crudActions,
    }
  }
)
