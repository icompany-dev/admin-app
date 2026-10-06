import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { PurchasedItemTracker } from "~/scripts/models/PurchasedItemTracker"

export const usePurchasedItemTrackerStore = defineStore("purchasedItemTracker", () => {
  const { $repositories } = useNuxtApp()

  const purchasedItemTrackers = ref<PurchasedItemTracker[]>([])
  const purchasedItemTracker = ref<PurchasedItemTracker | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.purchasedItemTrackers, {
    items: purchasedItemTrackers,
    item: purchasedItemTracker,
    isLoading: isLoading,
    error: error,
  })

  async function ongoingForCompany(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.purchasedItemTrackers.ongoingForCompany(companyId)
      return response
    } catch (e) {
      error.value = `Failed to `
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function orderChop(id: string, companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.purchasedItemTrackers.orderChop(id, companyId)
      return response
    } catch (e) {
      error.value = `Failed to `
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function orderChopUntracked(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.purchasedItemTrackers.orderChopUntracked(companyId)
      return response
    } catch (e) {
      error.value = `Failed to `
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function markReady(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.purchasedItemTrackers.markReady(id)
      return response
    } catch (e) {
      error.value = `Failed to `
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function markDelivered(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.purchasedItemTrackers.markDelivered(id)
      return response
    } catch (e) {
      error.value = `Failed to `
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalPurchasedItemTrackers = computed(() => purchasedItemTrackers.value.length)

  return {
    purchasedItemTrackers,
    purchasedItemTracker,
    isLoading,
    error,
    totalPurchasedItemTrackers,
    ...crudActions,
    ongoingForCompany,
    orderChop,
    orderChopUntracked,
    markReady,
    markDelivered,
  }
})
