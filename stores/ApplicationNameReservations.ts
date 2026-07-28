import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"

export const useApplicationNameReservationStore = defineStore("applicationNameReservation", () => {
  const { $repositories } = useNuxtApp()

  const applicationNameReservations = ref<ApplicationNameReservation[]>([])
  const applicationNameReservation = ref<ApplicationNameReservation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.applicationNameReservations, {
    items: applicationNameReservations,
    item: applicationNameReservation,
    isLoading: isLoading,
    error: error,
  })

  async function approve(id: string): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNameReservations.approve(id)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function reject(id: string, reason: string): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNameReservations.reject(id, reason)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const totalApplicationNameReservations = computed(() => applicationNameReservations.value.length)

  return {
    applicationNameReservations,
    applicationNameReservation,
    isLoading,
    error,
    totalApplicationNameReservations,
    ...crudActions,
    approve,
    reject,
  }
})
