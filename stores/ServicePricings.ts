import { defineStore } from "pinia"
import type { ServicePricing } from "~/scripts/models/ServicePricing"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useServicePricingStore = defineStore("servicePricing", () => {
  const { $repositories } = useNuxtApp()

  const servicePricings = ref<ServicePricing[]>([])
  const servicePricing = ref<ServicePricing | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.servicePricings, {
    items: servicePricings,
    item: servicePricing,
    isLoading: isLoading,
    error: error,
  })

  async function fetchDefault(serviceTarget: string): Promise<ServicePricing | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.servicePricings.fetchDefault(serviceTarget)
      return response.data ?? null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch price for target`
      console.error(`Error to fetch price for target`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByName(serviceName: string): Promise<ServicePricing | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.servicePricings.fetchByName(serviceName)
      return response.data ?? null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch price for target`
      console.error(`Error to fetch price for target`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchForTarget(targetType: string, targetId: string): Promise<ServicePricing | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.servicePricings.fetchForTarget(targetType, targetId)
      return response.data ?? null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch price for target`
      console.error(`Error to fetch price for target`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalServicePricings = computed(() => servicePricings.value.length)

  return {
    servicePricings,
    servicePricing,
    isLoading,
    error,
    totalServicePricings,
    ...crudActions,
    fetchDefault,
    fetchByName,
    fetchForTarget,
  }
})
