import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingCapitalisationOfProfit } from "~/scripts/models/CompanyConstitutionSettingCapitalisationOfProfit"

export const useCompanyConstitutionSettingCapitalisationOfProfitStore = defineStore(
  "companyConstitutionSettingCapitalisationOfProfit",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingCapitalisationOfProfits = ref<CompanyConstitutionSettingCapitalisationOfProfit[]>(
      []
    )
    const companyConstitutionSettingCapitalisationOfProfit =
      ref<CompanyConstitutionSettingCapitalisationOfProfit | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingCapitalisationOfProfits, {
      items: companyConstitutionSettingCapitalisationOfProfits,
      item: companyConstitutionSettingCapitalisationOfProfit,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingCapitalisationOfProfits = computed(
      () => companyConstitutionSettingCapitalisationOfProfits.value.length
    )

    return {
      companyConstitutionSettingCapitalisationOfProfits,
      companyConstitutionSettingCapitalisationOfProfit,
      isLoading,
      error,
      totalCompanyConstitutionSettingCapitalisationOfProfits,
      ...crudActions,
    }
  }
)
