import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import type { Filter } from "~/scripts/library/Filter"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { TransactionHistory } from "~/scripts/models/TransactionHistory"
import type { Storyline } from "~/scripts/models/Storyline"

export const useTransactionStore = defineStore("transactions", () => {
  const { $repositories } = useNuxtApp()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function hasArchivedData() {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.transactions.hasArchivedData()
      return response.data?.has_old_transactions ?? false
    } catch (e: any) {
      error.value = e.message || "Failed to check for past data"
      console.error(`Fail to check for past data`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTransactionHistory(filter: Filter, year: number): Promise<ApiRecord<TransactionHistory>> {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiRecord<TransactionHistory> = await $repositories.transactions.fetchTransactionHistory(
        filter,
        year
      )
      return response
    } catch (e: any) {
      error.value = e.message || "Failed to fetch transaction history"
      console.error(`Fail to fetch transaction history`, e)
      return new ApiRecord<TransactionHistory>(null, TransactionHistory)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByTarget(target: string, targetId: string): Promise<TransactionHistory | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.transactions.fetchByTarget(target, targetId)
      return response.data ? new TransactionHistory(response.data) : null
    } catch (e: any) {
      error.value = e.message || "Failed to fetch transaction history"
      console.error(`Fail to fetch transaction history`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchInitialStoryline(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.transactions.fetchInitialStoryline()
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch initial storyline"
      console.error(`Fail to fetch initial storyline`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchServicesStoryline(year: number): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.transactions.fetchServicesStoryline(year)
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch services storyline"
      console.error(`Fail to fetch services storyline`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSignaturesStoryline(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.transactions.fetchSignaturesStoryline()
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch signature storyline"
      console.error(`Fail to fetch signature storyline`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPaymentsStoryline(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.transactions.fetchPaymentsStoryline()
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch payment storyline"
      console.error(`Fail to fetch payment storyline`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    hasArchivedData,
    fetchTransactionHistory,
    fetchByTarget,
    fetchInitialStoryline,
    fetchServicesStoryline,
    fetchSignaturesStoryline,
    fetchPaymentsStoryline,
  }
})
