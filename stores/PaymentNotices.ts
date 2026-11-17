import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { PaymentNotice } from "~/scripts/models/PaymentNotice"

export const usePaymentNoticeStore = defineStore("paymentNotice", () => {
  const { $repositories } = useNuxtApp()

  const paymentNotices = ref<PaymentNotice[]>([])
  const paymentNotice = ref<PaymentNotice | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.paymentNotices, {
    items: paymentNotices,
    item: paymentNotice,
    isLoading: isLoading,
    error: error,
  })

  async function notify(id: string): Promise<any> {
    try {
      isLoading.value = true
      const response = await $repositories.paymentNotices.notify(id)
      return response
    } catch (err: any) {
      error.value = err.message || "An error occurred while notifying."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const totalPaymentNotices = computed(() => paymentNotices.value.length)

  return {
    paymentNotices,
    paymentNotice,
    isLoading,
    error,
    totalPaymentNotices,
    ...crudActions,
    notify,
  }
})
