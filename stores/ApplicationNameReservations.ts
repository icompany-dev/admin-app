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

  const totalApplicationNameReservations = computed(() => applicationNameReservations.value.length)

  return {
    applicationNameReservations,
    applicationNameReservation,
    isLoading,
    error,
    totalApplicationNameReservations,
    ...crudActions
  }
})
