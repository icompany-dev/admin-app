import { defineStore } from "pinia"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { ApplicationIncorporateProgress } from "~/scripts/models/ApplicationIncorporateProgress"

export const useApplicationIncorporateStore = defineStore("applicationIncorporate", () => {
  const { $repositories } = useNuxtApp()

  const applicationIncorporates = ref<ApplicationIncorporate[]>([])
  const applicationIncorporate = ref<ApplicationIncorporate | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.applicationIncorporates, {
    items: applicationIncorporates,
    item: applicationIncorporate,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllOld(slug: string | null): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporates.value = []
      const response: any = await $repositories.applicationIncorporates.fetchAllOld(slug)
      if (response.data) {
        applicationIncorporates.value.push(new ApplicationIncorporate(response.data))
      }
    } catch (e: any) {
      error.value = e.message || `Failed to fetch applicationIncorporates for user`
      console.error(`Error to fetch applicationIncorporates for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOngoing(): Promise<ApplicationIncorporate | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.fetchLatestOngoing()
      if (response.data) {
        applicationIncorporate.value = new ApplicationIncorporate(response.data)
        return applicationIncorporate.value
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProgress(id: string): Promise<ApplicationIncorporateProgress | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.fetchProgress(id)
      if (response) {
        return new ApplicationIncorporateProgress(response)
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createNameReservations(data: any): Promise<ApplicationIncorporate | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.createNameReservations(data)
      if (response) {
        applicationIncorporate.value = new ApplicationIncorporate(response)
        return applicationIncorporate.value
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateNameReservations(id: string, data: any): Promise<ApplicationIncorporate | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.updateNameReservations(id, data)
      if (response) {
        applicationIncorporate.value = new ApplicationIncorporate(response)
        return applicationIncorporate.value
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateDescriptionMsicCodes(id: string, data: any): Promise<ApplicationIncorporate | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.updateDescriptionMsicCodes(id, data)
      if (response) {
        applicationIncorporate.value = new ApplicationIncorporate(response)
        return applicationIncorporate.value
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateBusinessAddress(id: string, data: any): Promise<ApplicationIncorporate | null> {
    isLoading.value = true
    error.value = null

    try {
      applicationIncorporate.value = null
      const response: any = await $repositories.applicationIncorporates.updateBusinessAddress(id, data)
      if (response) {
        applicationIncorporate.value = new ApplicationIncorporate(response)
        return applicationIncorporate.value
      }
      return null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch ongoing application for user`
      console.error(`Error to fetch ongoing application for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function notifyApproved(id: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationIncorporates.notifyApproved(id)
      return response.is_notified ?? false
    } catch (e: any) {
      error.value = e
      console.error("Failed to notify approval", e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalApplicationIncorporates = computed(() => applicationIncorporates.value.length)

  return {
    applicationIncorporates,
    applicationIncorporate,
    isLoading,
    error,
    totalApplicationIncorporates,
    ...crudActions,
    fetchAllOld,
    fetchOngoing,
    fetchProgress,
    createNameReservations,
    updateNameReservations,
    updateDescriptionMsicCodes,
    updateBusinessAddress,
    notifyApproved,
  }
})
