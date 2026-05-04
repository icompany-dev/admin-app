import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"

export const useCompanyPostShareTransferStore = defineStore("companyPostShareTransfer", () => {
  const { $repositories } = useNuxtApp()

  const companyPostShareTransfers = ref<CompanyPostShareTransfer[]>([])
  const companyPostShareTransfer = ref<CompanyPostShareTransfer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyPostShareTransfers, {
    items: companyPostShareTransfers,
    item: companyPostShareTransfer,
    isLoading: isLoading,
    error: error,
  })

  async function fetchForTransfer(transferId: string): Promise<CompanyPostShareTransfer | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyPostShareTransfers.fetchForTransfer(transferId)
      return response.data ? new CompanyPostShareTransfer(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch post share transfer application`
      console.error(`Error to fetch post share transfer application`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function extend(id: string, data: any): Promise<CompanyPostShareTransfer | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyPostShareTransfers.extend(id, data)
      return response.data ? new CompanyPostShareTransfer(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to extend registration of transfer`
      console.error(`Error to extend registration of transfer`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSection105Date(transferId: string): Promise<string | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyPostShareTransfers.fetchSection105Date(transferId)
      return response.section105_date ?? null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch date for section 105`
      console.error(`Error to fetch date for section 105`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyPostShareTransfers = computed(() => companyPostShareTransfers.value.length)

  return {
    companyPostShareTransfers,
    companyPostShareTransfer,
    isLoading,
    error,
    totalCompanyPostShareTransfers,
    ...crudActions,
    fetchForTransfer,
    extend,
    fetchSection105Date,
  }
})
