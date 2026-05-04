import { defineStore } from "pinia"
import type { Order } from "~/scripts/models/Order"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import type { Filter } from "~/scripts/library/Filter"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import type { ReceiptData } from "~/scripts/models/ReceiptData"
import { OrderTransaction } from "~/scripts/models/OrderTransaction"

export const useOrderStore = defineStore("order", () => {
  const { $repositories } = useNuxtApp()

  const orders = ref<Order[]>([])
  const order = ref<Order | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.orders, {
    items: orders,
    item: order,
    isLoading: isLoading,
    error: error,
  })

  async function receipt(id: string): Promise<ReceiptData | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: ReceiptData = await $repositories.orders.receipt(id)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to create order for application`
      console.error(`Error to create order`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPaymentHistory(
    filter: Filter
  ): Promise<ApiRecord<OrderTransaction>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.orders.fetchPaymentHistory(filter)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment history`
      console.error(`Error to fetch payment history`, e)
      return new ApiRecord<OrderTransaction>(null, OrderTransaction)
    } finally {
      isLoading.value = false
    }
  }

  const totalOrders = computed(() => orders.value.length)

  return {
    orders,
    order,
    isLoading,
    error,
    totalOrders,
    ...crudActions,
    receipt,
    fetchPaymentHistory,
  }
})
