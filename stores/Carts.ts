import { defineStore } from "pinia"
import type { Cart } from "~/scripts/models/Cart"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import type { Filter } from "~/scripts/library/Filter"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { UnpaidCart } from "~/scripts/models/UnpaidCart"

export const useCartStore = defineStore("cart", () => {
  const { $repositories } = useNuxtApp()

  const carts = ref<Cart[]>([])
  const cart = ref<Cart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.carts, {
    items: carts,
    item: cart,
    isLoading: isLoading,
    error: error,
  })

  async function createApplicationCart(target: string, targetId: string) {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.carts.createApplicationCart(target, targetId)
      cart.value = response.data
    } catch (e: any) {
      error.value = e.message || `Failed to create cart for application`
      console.error(`Error to create cart`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUnpaids(filter: Filter): Promise<ApiRecord<UnpaidCart>> {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiRecord<UnpaidCart> = await $repositories.carts.fetchUnpaids(filter)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to create cart for application`
      console.error(`Error to create cart`, e)
      return new ApiRecord({}, UnpaidCart)
    } finally {
      isLoading.value = false
    }
  }

  const totalCarts = computed(() => carts.value.length)

  return {
    carts,
    cart,
    isLoading,
    error,
    totalCarts,
    ...crudActions,
    createApplicationCart,
    fetchUnpaids,
  }
})
