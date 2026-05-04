import { defineStore } from "pinia"
import type { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyManagementAccountStore = defineStore("companyManagementAccount", () => {
  const { $repositories } = useNuxtApp()

  const companyManagementAccounts = ref<CompanyManagementAccount[]>([])
  const companyManagementAccount = ref<CompanyManagementAccount | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyManagementAccounts, {
    items: companyManagementAccounts,
    item: companyManagementAccount,
    isLoading: isLoading,
    error: error,
  })

  async function fetchStartDate(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyManagementAccounts.fetchStartDate(companyId)
      return response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyManagementAccounts = computed(() => companyManagementAccounts.value.length)

  return {
    companyManagementAccounts,
    companyManagementAccount,
    isLoading,
    error,
    totalCompanyManagementAccounts,
    ...crudActions,
    fetchStartDate,
  }
})
