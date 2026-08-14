import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyNameReservation } from "~/scripts/models/CompanyNameReservation"

export const useCompanyNameReservationStore = defineStore("companyNameReservation", () => {
  const { $repositories } = useNuxtApp()

  const companyNameReservations = ref<CompanyNameReservation[]>([])
  const companyNameReservation = ref<CompanyNameReservation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyNameReservations, {
    items: companyNameReservations,
    item: companyNameReservation,
    isLoading: isLoading,
    error: error,
  })

  async function approve(id: string): Promise<CompanyNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNameReservations.approve(id)
      return response.data ? new CompanyNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function reject(id: string, reason: string): Promise<CompanyNameReservation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNameReservations.reject(id, reason)
      return response.data ? new CompanyNameReservation(response.data) : null
    } catch (e) {
      error.value = `Failed to update data: ${e}`
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyNameReservations = computed(() => companyNameReservations.value.length)

  return {
    companyNameReservations,
    companyNameReservation,
    isLoading,
    error,
    totalCompanyNameReservations,
    ...crudActions,
    approve,
    reject,
  }
})
