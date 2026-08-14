import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingRemovalOfDirector } from "~/scripts/models/CompanyConstitutionSettingRemovalOfDirector"

export const useCompanyConstitutionSettingRemovalOfDirectorStore = defineStore(
  "companyConstitutionSettingRemovalOfDirector",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingRemovalOfDirectors = ref<CompanyConstitutionSettingRemovalOfDirector[]>([])
    const companyConstitutionSettingRemovalOfDirector = ref<CompanyConstitutionSettingRemovalOfDirector | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingRemovalOfDirectors, {
      items: companyConstitutionSettingRemovalOfDirectors,
      item: companyConstitutionSettingRemovalOfDirector,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingRemovalOfDirectors = computed(
      () => companyConstitutionSettingRemovalOfDirectors.value.length
    )

    return {
      companyConstitutionSettingRemovalOfDirectors,
      companyConstitutionSettingRemovalOfDirector,
      isLoading,
      error,
      totalCompanyConstitutionSettingRemovalOfDirectors,
      ...crudActions,
    }
  }
)
