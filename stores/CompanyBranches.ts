import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyBranch } from "~/scripts/models/CompanyBranch"

export const useCompanyBranchStore = defineStore("companyBranch", () => {
  const { $repositories } = useNuxtApp()

  const companyBranches = ref<CompanyBranch[]>([])
  const companyBranch = ref<CompanyBranch | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyBranches, {
    items: companyBranches,
    item: companyBranch,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAmendmentBranches = computed(() => companyBranches.value.length)

  return {
    companyBranches,
    companyBranch,
    isLoading,
    error,
    totalCompanyAmendmentBranches,
    ...crudActions
  }
})
