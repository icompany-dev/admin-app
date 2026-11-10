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

  const totalPaymentNotices = computed(() => paymentNotices.value.length)

  return {
    paymentNotices,
    paymentNotice,
    isLoading,
    error,
    totalPaymentNotices,
    ...crudActions
  }
})
