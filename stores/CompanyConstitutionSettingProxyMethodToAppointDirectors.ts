import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingMethodToAppointDirector } from "~/scripts/models/CompanyConstitutionSettingMethodToAppointDirector"

export const useCompanyConstitutionSettingMethodToAppointDirectorStore = defineStore(
  "companyConstitutionSettingMethodToAppointDirector",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingMethodToAppointDirectors = ref<CompanyConstitutionSettingMethodToAppointDirector[]>(
      []
    )
    const companyConstitutionSettingMethodToAppointDirector =
      ref<CompanyConstitutionSettingMethodToAppointDirector | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingMethodToAppointDirectors, {
      items: companyConstitutionSettingMethodToAppointDirectors,
      item: companyConstitutionSettingMethodToAppointDirector,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingMethodToAppointDirectors = computed(
      () => companyConstitutionSettingMethodToAppointDirectors.value.length
    )

    return {
      companyConstitutionSettingMethodToAppointDirectors,
      companyConstitutionSettingMethodToAppointDirector,
      isLoading,
      error,
      totalCompanyConstitutionSettingMethodToAppointDirectors,
      ...crudActions,
    }
  }
)
