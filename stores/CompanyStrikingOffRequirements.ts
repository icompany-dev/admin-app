import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffRequirement } from "~/scripts/models/CompanyStrikingOffRequirement"

export const useCompanyStrikingOffRequirementStore = defineStore("companyStrikingOffRequirement", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffRequirements = ref<CompanyStrikingOffRequirement[]>([])
  const companyStrikingOffRequirement = ref<CompanyStrikingOffRequirement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffRequirements, {
    items: companyStrikingOffRequirements,
    item: companyStrikingOffRequirement,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyStrikingOffRequirements = computed(() => companyStrikingOffRequirements.value.length)

  return {
    companyStrikingOffRequirements,
    companyStrikingOffRequirement,
    isLoading,
    error,
    totalCompanyStrikingOffRequirements,
    ...crudActions
  }
})
