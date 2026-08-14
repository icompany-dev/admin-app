import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyShareholderTransferNotice } from "~/scripts/models/CompanyShareholderTransferNotice"

export const useCompanyShareholderTransferNoticeStore = defineStore("companyShareholderTransferNotice", () => {
  const { $repositories } = useNuxtApp()

  const companyShareholderTransferNotices = ref<CompanyShareholderTransferNotice[]>([])
  const companyShareholderTransferNotice = ref<CompanyShareholderTransferNotice | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyShareholderTransferNotices, {
    items: companyShareholderTransferNotices,
    item: companyShareholderTransferNotice,
    isLoading: isLoading,
    error: error,
  })

  async function fetchForTransfer(transferId: string): Promise<CompanyShareholderTransferNotice | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransferNotices.fetchForTransfer(transferId)
      return response.data ? new CompanyShareholderTransferNotice(response.data) : null
    } catch (e: any) {
      console.error(`Failed to fetch notice for transfer id ${transferId}`, e)
      error.value = `Failed to fetch notice for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyShareholderTransferNotices = computed(() => companyShareholderTransferNotices.value.length)

  return {
    companyShareholderTransferNotices,
    companyShareholderTransferNotice,
    isLoading,
    error,
    totalCompanyShareholderTransferNotices,
    ...crudActions,
    fetchForTransfer,
  }
})
