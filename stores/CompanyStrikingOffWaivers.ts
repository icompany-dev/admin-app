import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffWaiver } from "~/scripts/models/CompanyStrikingOffWaiver"

export const useCompanyStrikingOffWaiverStore = defineStore("companyStrikingOffWaiver", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffWaivers = ref<CompanyStrikingOffWaiver[]>([])
  const companyStrikingOffWaiver = ref<CompanyStrikingOffWaiver | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffWaivers, {
    items: companyStrikingOffWaivers,
    item: companyStrikingOffWaiver,
    isLoading: isLoading,
    error: error,
  })

  async function customCreate(strikingOffResolutionId: string, data: object): Promise<CompanyStrikingOffWaiver | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyStrikingOffWaivers.create(strikingOffResolutionId, data)
      return new CompanyStrikingOffWaiver(response.data)
    } catch (e) {
      console.error("failed to create application")
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyStrikingOffWaivers = computed(() => companyStrikingOffWaivers.value.length)

  return {
    companyStrikingOffWaivers,
    companyStrikingOffWaiver,
    isLoading,
    error,
    totalCompanyStrikingOffWaivers,
    ...crudActions,
    customCreate,
  }
})
