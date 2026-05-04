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

  const totalCompanyNameReservations = computed(() => companyNameReservations.value.length)

  return {
    companyNameReservations,
    companyNameReservation,
    isLoading,
    error,
    totalCompanyNameReservations,
    ...crudActions
  }
})
