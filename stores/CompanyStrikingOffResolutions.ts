import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"

export const useCompanyStrikingOffResolutionStore = defineStore("companyStrikingOffResolution", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffResolutions = ref<CompanyStrikingOffResolution[]>([])
  const companyStrikingOffResolution = ref<CompanyStrikingOffResolution | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffResolutions, {
    items: companyStrikingOffResolutions,
    item: companyStrikingOffResolution,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyStrikingOffs = computed(() => companyStrikingOffResolutions.value.length)

  return {
    companyStrikingOffResolutions,
    companyStrikingOffResolution,
    isLoading,
    error,
    totalCompanyStrikingOffs,
    ...crudActions,
  }
})
