import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingElectronicParticipation } from "~/scripts/models/CompanyConstitutionSettingElectronicParticipation"

export const useCompanyConstitutionSettingElectronicParticipationStore = defineStore("companyConstitutionSettingElectronicParticipation", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingElectronicParticipations = ref<CompanyConstitutionSettingElectronicParticipation[]>([])
  const companyConstitutionSettingElectronicParticipation = ref<CompanyConstitutionSettingElectronicParticipation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingElectronicParticipations, {
    items: companyConstitutionSettingElectronicParticipations,
    item: companyConstitutionSettingElectronicParticipation,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingElectronicParticipations = computed(() => companyConstitutionSettingElectronicParticipations.value.length)

  return {
    companyConstitutionSettingElectronicParticipations,
    companyConstitutionSettingElectronicParticipation,
    isLoading,
    error,
    totalCompanyConstitutionSettingElectronicParticipations,
    ...crudActions
  }
})
