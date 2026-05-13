import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { AdminPaymentReceived } from "~/scripts/models/AdminPaymentReceived"

export const useAdminPaymentReceivedStore = defineStore("adminPaymentReceived", () => {
  const { $repositories } = useNuxtApp()

  const adminPaymentReceiveds = ref<AdminPaymentReceived[]>([])
  const adminPaymentReceived = ref<AdminPaymentReceived | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.adminPaymentReceiveds, {
    items: adminPaymentReceiveds,
    item: adminPaymentReceived,
    isLoading: isLoading,
    error: error,
  })

  const totalAdminPaymentReceiveds = computed(() => adminPaymentReceiveds.value.length)

  return {
    adminPaymentReceiveds,
    adminPaymentReceived,
    isLoading,
    error,
    totalAdminPaymentReceiveds,
    ...crudActions
  }
})
