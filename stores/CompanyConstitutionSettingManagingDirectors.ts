import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingManagingDirector } from "~/scripts/models/CompanyConstitutionSettingManagingDirector"

export const useCompanyConstitutionSettingManagingDirectorStore = defineStore("companyConstitutionSettingManagingDirector", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingManagingDirectors = ref<CompanyConstitutionSettingManagingDirector[]>([])
  const companyConstitutionSettingManagingDirector = ref<CompanyConstitutionSettingManagingDirector | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingManagingDirectors, {
    items: companyConstitutionSettingManagingDirectors,
    item: companyConstitutionSettingManagingDirector,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingManagingDirectors = computed(() => companyConstitutionSettingManagingDirectors.value.length)

  return {
    companyConstitutionSettingManagingDirectors,
    companyConstitutionSettingManagingDirector,
    isLoading,
    error,
    totalCompanyConstitutionSettingManagingDirectors,
    ...crudActions
  }
})
