import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingQuorumRequirement } from "~/scripts/models/CompanyConstitutionSettingQuorumRequirement"

export const useCompanyConstitutionSettingQuorumRequirementStore = defineStore("companyConstitutionSettingQuorumRequirement", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingQuorumRequirements = ref<CompanyConstitutionSettingQuorumRequirement[]>([])
  const companyConstitutionSettingQuorumRequirement = ref<CompanyConstitutionSettingQuorumRequirement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingQuorumRequirements, {
    items: companyConstitutionSettingQuorumRequirements,
    item: companyConstitutionSettingQuorumRequirement,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingQuorumRequirements = computed(() => companyConstitutionSettingQuorumRequirements.value.length)

  return {
    companyConstitutionSettingQuorumRequirements,
    companyConstitutionSettingQuorumRequirement,
    isLoading,
    error,
    totalCompanyConstitutionSettingQuorumRequirements,
    ...crudActions
  }
})
