import { defineStore } from "pinia"
import type { ServiceLog } from "~/scripts/models/ServiceLog"
import { useNuxtApp } from "#app"
import { DirectorLog } from "~/scripts/models/DirectorLog"
import type { Filter } from "~/scripts/library/Filter"
import { ShareholderLog } from "~/scripts/models/ShareholderLog"

export const useLogStore = defineStore("log", () => {
  const { $repositories } = useNuxtApp()

  const logs = ref<ServiceLog[]>([])
  const log = ref<ServiceLog | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDirectorLogs(
    companyId: string,
    year: number,
    directorId: string,
    filter: Filter
  ): Promise<DirectorLog[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.logs.fetchDirectorLogs(companyId, year, directorId, filter)
      if (!response.data || !Array.isArray(response.data)) {
        return []
      }

      return response.data.map((d: any) => {
        return new DirectorLog(d)
      })
    } catch (e: any) {
      error.value = e.message || `Failed to fetch director logs for company`
      console.error(`Error to fetch director logs by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchShareholderLogs(
    companyId: string,
    year: number,
    directorId: string,
    filter: Filter
  ): Promise<ShareholderLog[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.logs.fetchShareholderLogs(companyId, year, directorId, filter)
      if (!response.data || Array.isArray(response.data)) {
        return []
      }

      return response.data.map((d: any) => {
        return new ShareholderLog(d)
      })
    } catch (e: any) {
      error.value = e.message || `Failed to fetch director logs for company`
      console.error(`Error to fetch director logs by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalServiceLogs = computed(() => logs.value.length)

  return {
    logs,
    log,
    isLoading,
    error,
    totalServiceLogs,
    fetchDirectorLogs,
    fetchShareholderLogs,
  }
})
