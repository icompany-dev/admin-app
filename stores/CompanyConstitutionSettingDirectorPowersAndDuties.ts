import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingDirectorPowersAndDuty } from "~/scripts/models/CompanyConstitutionSettingDirectorPowersAndDuty"

export const useCompanyConstitutionSettingDirectorPowersAndDutyStore = defineStore(
  "companyConstitutionSettingDirectorPowersAndDuty",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingDirectorPowersAndDuties = ref<CompanyConstitutionSettingDirectorPowersAndDuty[]>([])
    const companyConstitutionSettingDirectorPowersAndDuty = ref<CompanyConstitutionSettingDirectorPowersAndDuty | null>(
      null
    )
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingDirectorPowersAndDuties, {
      items: companyConstitutionSettingDirectorPowersAndDuties,
      item: companyConstitutionSettingDirectorPowersAndDuty,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingDirectorPowersAndDuties = computed(
      () => companyConstitutionSettingDirectorPowersAndDuties.value.length
    )

    return {
      companyConstitutionSettingDirectorPowersAndDuties,
      companyConstitutionSettingDirectorPowersAndDuty,
      isLoading,
      error,
      totalCompanyConstitutionSettingDirectorPowersAndDuties,
      ...crudActions,
    }
  }
)
