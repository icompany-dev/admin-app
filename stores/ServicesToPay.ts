import { defineStore } from "pinia"
import type { ServiceToPay } from "~/scripts/models/ServiceToPay"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useServiceToPayStore = defineStore("serviceToPay", () => {
  const { $repositories } = useNuxtApp()

  const servicesToPay = ref<ServiceToPay[]>([])
  const serviceToPay = ref<ServiceToPay | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.servicesToPay, {
    items: servicesToPay,
    item: serviceToPay,
    isLoading: isLoading,
    error: error,
  })

  const totalServiceToPays = computed(() => servicesToPay.value.length)

  return {
    servicesToPay,
    serviceToPay,
    isLoading,
    error,
    totalServiceToPays,
    ...crudActions,
  }
})
