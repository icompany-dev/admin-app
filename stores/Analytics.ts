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

  async function fetchDeliveries(filter: Filter): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchDeliveries(filter)
      return response
    } catch (e) {
      console.error(`Failed to fetch deliveries statistics`, e)
      error.value = "Failed to fetch deliveries statistics"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchPaymentSince(filter: Filter): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchPaymentSince(filter)
      return response
    } catch (e) {
      console.error(`Failed to fetch payment since`, e)
      error.value = "Failed to fetch payment since"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchUserCoordinates(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchUserCoordinates()
      return response
    } catch (e) {
      console.error(`Failed to fetch user coordinates`, e)
      error.value = "Failed to fetch user coordinates"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchCompanyCoordinates(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchCompanyCoordinates()
      return response
    } catch (e) {
      console.error(`Failed to fetch company coordinates`, e)
      error.value = "Failed to fetch company coordinates"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchCompanyCounts(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchCompanyCounts()
      return response
    } catch (e) {
      console.error(`Failed to fetch company counts`, e)
      error.value = "Failed to fetch company counts"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchUserCounts(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchUserCounts()
      return response
    } catch (e) {
      console.error(`Failed to fetch user counts`, e)
      error.value = "Failed to fetch user counts"

      return null
    } finally {
      isLoading.value = true
    }
  }

  async function fetchPaymentCounts(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.analytics.fetchPaymentCounts()
      return response
    } catch (e) {
      console.error(`Failed to fetch payment counts`, e)
      error.value = "Failed to fetch payment counts"

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
    fetchDeliveries,
    fetchPaymentSince,
    fetchUserCoordinates,
    fetchCompanyCoordinates,
    fetchCompanyCounts,
    fetchUserCounts,
    fetchPaymentCounts,
  }
})
