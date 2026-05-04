import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"

export const useCompanyAmendmentBranchStore = defineStore("companyAmendmentBranch", () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentBranches = ref<CompanyAmendmentBranch[]>([])
  const companyAmendmentBranch = ref<CompanyAmendmentBranch | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentBranches, {
    items: companyAmendmentBranches,
    item: companyAmendmentBranch,
    isLoading: isLoading,
    error: error,
  })

  async function hasOngoing(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAmendmentBranches.hasOngoing(companyId)
      return response.has_ongoing ? response.has_ongoing === 1 : false
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentBranches = computed(() => companyAmendmentBranches.value.length)

  return {
    companyAmendmentBranches,
    companyAmendmentBranch,
    isLoading,
    error,
    totalCompanyAmendmentBranches,
    ...crudActions,
    hasOngoing,
  }
})
