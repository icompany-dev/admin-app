import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffClearance } from "~/scripts/models/CompanyStrikingOffClearance"

export const useCompanyStrikingOffClearanceStore = defineStore("companyStrikingOffClearance", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffClearances = ref<CompanyStrikingOffClearance[]>([])
  const companyStrikingOffClearance = ref<CompanyStrikingOffClearance | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffClearances, {
    items: companyStrikingOffClearances,
    item: companyStrikingOffClearance,
    isLoading: isLoading,
    error: error,
  })

  async function customCreate(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffClearance | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyStrikingOffClearances.create(strikingOffResolutionId, data)
      return new CompanyStrikingOffClearance(response.data)
    } catch (e) {
      console.error("failed to create application")
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyStrikingOffClearances = computed(() => companyStrikingOffClearances.value.length)

  return {
    companyStrikingOffClearances,
    companyStrikingOffClearance,
    isLoading,
    error,
    totalCompanyStrikingOffClearances,
    ...crudActions,
    customCreate,
  }
})
