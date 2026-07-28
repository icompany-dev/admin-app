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

  async function submitted(incorporationId: string, data: object): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationNameReservations.submitted(incorporationId, data)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function queried(incorporationId: string, data: object): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationNameReservations.queried(incorporationId, data)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function resubmitted(incorporationId: string, data: object): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationNameReservations.resubmitted(incorporationId, data)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function approve(incorporationId: string, data: object): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationNameReservations.approved(incorporationId, data)
      return response.data ? new ApplicationNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function reject(incorporationId: string, reason: string): Promise<ApplicationNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.applicationNameReservations.rejected(incorporationId, reason)
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
    submitted,
    resubmitted,
    queried,
    approve,
    reject,
  }
})
