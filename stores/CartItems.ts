import { defineStore } from "pinia"
import type { CartItem } from "~/scripts/models/CartItem"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCartItemStore = defineStore("cartItem", () => {
  const { $repositories } = useNuxtApp()

  const cartItems = ref<CartItem[]>([])
  const cartItem = ref<CartItem | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.cartItems, {
    items: cartItems,
    item: cartItem,
    isLoading: isLoading,
    error: error,
  })

  const totalCartItems = computed(() => cartItems.value.length)

  return {
    cartItems,
    cartItem,
    isLoading,
    error,
    totalCartItems,
    ...crudActions,
  }
})
