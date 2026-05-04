import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"

export const useCompanyAmendmentAddressStore = defineStore("companyAmendmentAddress", () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentAddresses = ref<CompanyAmendmentAddress[]>([])
  const companyAmendmentAddress = ref<CompanyAmendmentAddress | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentAddresses, {
    items: companyAmendmentAddresses,
    item: companyAmendmentAddress,
    isLoading: isLoading,
    error: error,
  })

  async function hasOngoing(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAmendmentAddresses.hasOngoing(companyId)
      return response.has_ongoing ? response.has_ongoing === 1 : false
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentAddresses = computed(() => companyAmendmentAddresses.value.length)

  return {
    companyAmendmentAddresses,
    companyAmendmentAddress,
    isLoading,
    error,
    totalCompanyAmendmentAddresses,
    ...crudActions,
    hasOngoing,
  }
})
