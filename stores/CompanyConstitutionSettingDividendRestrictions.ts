import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingDividendRestriction } from "~/scripts/models/CompanyConstitutionSettingDividendRestriction"

export const useCompanyConstitutionSettingDividendRestrictionStore = defineStore(
  "companyConstitutionSettingDividendRestriction",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingDividendRestrictions = ref<CompanyConstitutionSettingDividendRestriction[]>([])
    const companyConstitutionSettingDividendRestriction = ref<CompanyConstitutionSettingDividendRestriction | null>(
      null
    )
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingDividendRestrictions, {
      items: companyConstitutionSettingDividendRestrictions,
      item: companyConstitutionSettingDividendRestriction,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingDividendRestrictions = computed(
      () => companyConstitutionSettingDividendRestrictions.value.length
    )

    return {
      companyConstitutionSettingDividendRestrictions,
      companyConstitutionSettingDividendRestriction,
      isLoading,
      error,
      totalCompanyConstitutionSettingDividendRestrictions,
      ...crudActions,
    }
  }
)
