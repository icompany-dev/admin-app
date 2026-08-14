import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffApplication } from "~/scripts/models/CompanyStrikingOffApplication"

export const useCompanyStrikingOffApplicationStore = defineStore("companyStrikingOffApplication", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffApplications = ref<CompanyStrikingOffApplication[]>([])
  const companyStrikingOffApplication = ref<CompanyStrikingOffApplication | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffApplications, {
    items: companyStrikingOffApplications,
    item: companyStrikingOffApplication,
    isLoading: isLoading,
    error: error,
  })

  async function customCreate(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffApplication | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyStrikingOffApplications.create(strikingOffResolutionId, data)
      return new CompanyStrikingOffApplication(response.data)
    } catch (e) {
      console.error("failed to create application")
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyStrikingOffApplications = computed(() => companyStrikingOffApplications.value.length)

  return {
    companyStrikingOffApplications,
    companyStrikingOffApplication,
    isLoading,
    error,
    totalCompanyStrikingOffApplications,
    ...crudActions,
    customCreate,
  }
})
