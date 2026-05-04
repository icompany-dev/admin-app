import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingCasualVacanciesOfDirector } from "~/scripts/models/CompanyConstitutionSettingCasualVacanciesOfDirector"

export const useCompanyConstitutionSettingCasualVacanciesOfDirectorStore = defineStore(
  "companyConstitutionSettingCasualVacanciesOfDirector",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingCasualVacanciesOfDirectors = ref<
      CompanyConstitutionSettingCasualVacanciesOfDirector[]
    >([])
    const companyConstitutionSettingCasualVacanciesOfDirector =
      ref<CompanyConstitutionSettingCasualVacanciesOfDirector | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingCasualVacanciesOfDirectors, {
      items: companyConstitutionSettingCasualVacanciesOfDirectors,
      item: companyConstitutionSettingCasualVacanciesOfDirector,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingCasualVacanciesOfDirectors = computed(
      () => companyConstitutionSettingCasualVacanciesOfDirectors.value.length
    )

    return {
      companyConstitutionSettingCasualVacanciesOfDirectors,
      companyConstitutionSettingCasualVacanciesOfDirector,
      isLoading,
      error,
      totalCompanyConstitutionSettingCasualVacanciesOfDirectors,
      ...crudActions,
    }
  }
)
