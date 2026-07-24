import { defineStore } from "pinia"
import type { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { PaymentBill } from "~/scripts/models/PaymentBill"

export const usePaymentOrderStore = defineStore("paymentOrder", () => {
  const { $repositories } = useNuxtApp()

  const paymentOrders = ref<PaymentOrder[]>([])
  const paymentOrder = ref<PaymentOrder | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.paymentOrders, {
    items: paymentOrders,
    item: paymentOrder,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByCart(paymentCartId: string): Promise<PaymentOrder | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentOrder = await $repositories.paymentOrders.fetchByCart(paymentCartId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for entity`
      console.error(`Error to fetch payment order for entity`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function makePayment(data: any): Promise<PaymentBill | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.paymentOrders.makePayment(data)
      return response.data ? new PaymentBill(response.data) : null
    } catch (e: any) {
      error.value = e.message || `Failed to make payment`
      console.error(`Error to make payment`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByReferenceNumber(referenceNumber: string): Promise<PaymentOrder | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentOrder = await $repositories.paymentOrders.fetchByReferenceNumber(referenceNumber)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for entity`
      console.error(`Error to fetch payment order for entity`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByPaymentBill(paymentBillId: number): Promise<PaymentOrder | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentOrder = await $repositories.paymentOrders.fetchByPaymentBill(paymentBillId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for entity`
      console.error(`Error to fetch payment order for entity`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPendingDeliveries(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.paymentOrders.fetchPendingDeliveries()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for entity`
      console.error(`Error to fetch payment order for entity`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchForReceipt(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.paymentOrders.fetchForReceipt(id)
      return response.data
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for receipt`
      console.error(`Error to fetch payment order for receipt`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchItem(target: string, targetId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.paymentOrders.fetchItem(target, targetId)
      return response.data
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for receipt`
      console.error(`Error to fetch payment order for receipt`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByTarget(target: string, targetId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.paymentOrders.fetchByTarget(target, targetId)
      return response.data
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for receipt`
      console.error(`Error to fetch payment order for receipt`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function shipItem(target: string, targetId: string, trackingNumber: string, trackingUrl: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.paymentOrders.shipItem(target, targetId, trackingNumber, trackingUrl)
      return response.data
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment order for receipt`
      console.error(`Error to fetch payment order for receipt`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalPaymentOrders = computed(() => paymentOrders.value.length)

  return {
    paymentOrders,
    paymentOrder,
    isLoading,
    error,
    totalPaymentOrders,
    ...crudActions,
    fetchByCart,
    makePayment,
    fetchByReferenceNumber,
    fetchByPaymentBill,
    fetchPendingDeliveries,
    fetchForReceipt,
    fetchItem,
    fetchByTarget,
    shipItem,
  }
})
