import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingAllotmentAndPRN } from "~/scripts/models/CompanyConstitutionSettingAllotmentAndPRN"

export const useCompanyConstitutionSettingAllotmentAndPRNStore = defineStore(
  "companyConstitutionSettingAllotmentAndPRN",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingAllotmentAndPRNs = ref<CompanyConstitutionSettingAllotmentAndPRN[]>([])
    const companyConstitutionSettingAllotmentAndPRN = ref<CompanyConstitutionSettingAllotmentAndPRN | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingAllotmentAndPRNs, {
      items: companyConstitutionSettingAllotmentAndPRNs,
      item: companyConstitutionSettingAllotmentAndPRN,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingAllotmentAndPRNs = computed(
      () => companyConstitutionSettingAllotmentAndPRNs.value.length
    )

    return {
      companyConstitutionSettingAllotmentAndPRNs,
      companyConstitutionSettingAllotmentAndPRN,
      isLoading,
      error,
      totalCompanyConstitutionSettingAllotmentAndPRNs,
      ...crudActions,
    }
  }
)
