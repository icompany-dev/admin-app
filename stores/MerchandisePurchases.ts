import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { MerchandisePurchase } from "~/scripts/models/MerchandisePurchase"

export const useMerchandisePurchaseStore = defineStore("merchandisePurchase", () => {
  const { $repositories } = useNuxtApp()

  const merchandisePurchases = ref<MerchandisePurchase[]>([])
  const merchandisePurchase = ref<MerchandisePurchase | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.merchandisePurchases, {
    items: merchandisePurchases,
    item: merchandisePurchase,
    isLoading: isLoading,
    error: error,
  })

  const totalMerchandisePurchases = computed(() => merchandisePurchases.value.length)

  return {
    merchandisePurchases,
    merchandisePurchase,
    isLoading,
    error,
    totalMerchandisePurchases,
    ...crudActions,
  }
})
