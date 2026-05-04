import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingReductionOfShares } from "~/scripts/models/CompanyConstitutionSettingReductionOfShares"

export const useCompanyConstitutionSettingReductionOfSharesStore = defineStore(
  "companyConstitutionSettingReductionOfShares",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingReductionOfShares = ref<CompanyConstitutionSettingReductionOfShares[]>([])
    const companyConstitutionSettingReductionOfShare = ref<CompanyConstitutionSettingReductionOfShares | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingReductionOfShares, {
      items: companyConstitutionSettingReductionOfShares,
      item: companyConstitutionSettingReductionOfShare,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingReductionOfShares = computed(
      () => companyConstitutionSettingReductionOfShares.value.length
    )

    return {
      companyConstitutionSettingReductionOfShares,
      companyConstitutionSettingReductionOfShare,
      isLoading,
      error,
      totalCompanyConstitutionSettingReductionOfShares,
      ...crudActions,
    }
  }
)
