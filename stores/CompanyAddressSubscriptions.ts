import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAddressSubscription } from "~/scripts/models/CompanyAddressSubscription"

export const useCompanyAddressSubscriptionStore = defineStore("companyAddressSubscription", () => {
  const { $repositories } = useNuxtApp()

  const companyAddressSubscriptions = ref<CompanyAddressSubscription[]>([])
  const companyAddressSubscription = ref<CompanyAddressSubscription | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAddressSubscriptions, {
    items: companyAddressSubscriptions,
    item: companyAddressSubscription,
    isLoading: isLoading,
    error: error,
  })

  async function renew(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAddressSubscriptions.renew(companyId)
      return response.data ?? response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function acknowledge(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAddressSubscriptions.acknowledge(companyId)
      return response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function expirings(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAddressSubscriptions.expirings()
      return response.data ?? response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function finalNotices(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAddressSubscriptions.finalNotices()
      return response.data ?? response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAddressSubscriptions = computed(() => companyAddressSubscriptions.value.length)

  return {
    companyAddressSubscriptions,
    companyAddressSubscription,
    isLoading,
    error,
    totalCompanyAddressSubscriptions,
    ...crudActions,
    renew,
    acknowledge,
    expirings,
    finalNotices,
  }
})
