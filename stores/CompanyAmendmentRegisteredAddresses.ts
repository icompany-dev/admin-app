import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAmendmentRegisteredAddress } from "~/scripts/models/CompanyAmendmentRegisteredAddress"

export const useCompanyAmendmentRegisteredAddressStore = defineStore("companyAmendmentRegisteredAddress", () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentRegisteredAddresses = ref<CompanyAmendmentRegisteredAddress[]>([])
  const companyAmendmentRegisteredAddress = ref<CompanyAmendmentRegisteredAddress | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentRegisteredAddresses, {
    items: companyAmendmentRegisteredAddresses,
    item: companyAmendmentRegisteredAddress,
    isLoading: isLoading,
    error: error,
  })

  async function hasOngoing(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAmendmentRegisteredAddresses.hasOngoing(companyId)
      return response.has_ongoing ? response.has_ongoing === 1 : false
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment registered addresses`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentRegisteredAddresses = computed(() => companyAmendmentRegisteredAddresses.value.length)

  return {
    companyAmendmentRegisteredAddresses,
    companyAmendmentRegisteredAddress,
    isLoading,
    error,
    totalCompanyAmendmentRegisteredAddresses,
    ...crudActions,
    hasOngoing,
  }
})
