import { defineStore } from "pinia"
import type { PaymentCart } from "~/scripts/models/PaymentCart"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const usePaymentCartStore = defineStore("paymentCart", () => {
  const { $repositories } = useNuxtApp()

  const paymentCarts = ref<PaymentCart[]>([])
  const paymentCart = ref<PaymentCart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.paymentCarts, {
    items: paymentCarts,
    item: paymentCart,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByEntity(entityId: string, entityType: string): Promise<PaymentCart | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentCart = await $repositories.paymentCarts.fetchByEntity(entityId, entityType)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch payment cart for entity`
      console.error(`Error to fetch payment cart for entity`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addToCart(id: string, data: any): Promise<PaymentCart | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentCart = await $repositories.paymentCarts.addToCart(id, data)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to add item to cart`
      console.error(`Error to add item to cart`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateCartItem(id: string, data: any): Promise<PaymentCart | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentCart = await $repositories.paymentCarts.updateCartItem(id, data)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to add item to cart`
      console.error(`Error to add item to cart`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function removeFromCart(id: string, paymentCartItem: string): Promise<PaymentCart | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: PaymentCart = await $repositories.paymentCarts.removeFromCart(id, paymentCartItem, {})
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to add item to cart`
      console.error(`Error to add item to cart`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalPaymentCarts = computed(() => paymentCarts.value.length)

  return {
    paymentCarts,
    paymentCart,
    isLoading,
    error,
    totalPaymentCarts,
    ...crudActions,
    fetchByEntity,
    addToCart,
    updateCartItem,
    removeFromCart,
  }
})
