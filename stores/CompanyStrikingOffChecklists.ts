import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffChecklist } from "~/scripts/models/CompanyStrikingOffChecklist"

export const useCompanyStrikingOffChecklistStore = defineStore("companyStrikingOffChecklist", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffChecklists = ref<CompanyStrikingOffChecklist[]>([])
  const companyStrikingOffChecklist = ref<CompanyStrikingOffChecklist | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffChecklists, {
    items: companyStrikingOffChecklists,
    item: companyStrikingOffChecklist,
    isLoading: isLoading,
    error: error,
  })

  async function customCreate(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffChecklist | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyStrikingOffChecklists.create(strikingOffResolutionId, data)
      return new CompanyStrikingOffChecklist(response.data)
    } catch (e) {
      console.error("failed to create application")
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyStrikingOffChecklists = computed(() => companyStrikingOffChecklists.value.length)

  return {
    companyStrikingOffChecklists,
    companyStrikingOffChecklist,
    isLoading,
    error,
    totalCompanyStrikingOffChecklists,
    ...crudActions,
    customCreate,
  }
})
