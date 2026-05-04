import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"

export const useCompanyAmendmentDescriptionStore = defineStore("companyAmendmentDescription", () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentDescriptions = ref<CompanyAmendmentDescription[]>([])
  const companyAmendmentDescription = ref<CompanyAmendmentDescription | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentDescriptions, {
    items: companyAmendmentDescriptions,
    item: companyAmendmentDescription,
    isLoading: isLoading,
    error: error,
  })

  async function hasOngoing(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAmendmentDescriptions.hasOngoing(companyId)
      return response.has_ongoing ? response.has_ongoing === 1 : false
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentDescriptions = computed(() => companyAmendmentDescriptions.value.length)

  return {
    companyAmendmentDescriptions,
    companyAmendmentDescription,
    isLoading,
    error,
    totalCompanyAmendmentDescriptions,
    ...crudActions,
    hasOngoing,
  }
})
