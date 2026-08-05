import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { Model } from "~/scripts/models/Model"
import type { Filter } from "~/scripts/library/Filter"

export const useAnalyticsStore = defineStore("analytics", () => {
  const { $repositories } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchIncorporationBy(filter: Filter): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchIncorporationBy(filter)
      return response
    } catch (e) {
      console.error(`Failed to fetch incorporation statistics`, e)
      error.value = "Failed to fetch incorporation statistics"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchSwitchBy(filter: Filter): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchSwitchBy(filter)
      return response
    } catch (e) {
      console.error(`Failed to fetch switch statistics`, e)
      error.value = "Failed to fetch switch statistics"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchPaymentBy(filter: Filter): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchPaymentBy(filter)
      return response
    } catch (e) {
      console.error(`Failed to fetch payment statistics`, e)
      error.value = "Failed to fetch payment statistics"

      return null
    } finally {
      isLoading.value = true
    }
  }

  return {
    isLoading,
    error,
    fetchIncorporationBy,
    fetchSwitchBy,
    fetchPaymentBy,
  }
})
