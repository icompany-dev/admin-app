import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { BillplzPaymentGateway } from "~/scripts/models/BillplzPaymentGateway"

export const useBillplzPaymentGatewayStore = defineStore("billplzPaymentGateway", () => {
  const { $repositories } = useNuxtApp()
  const billplzPaymentGateways = ref<BillplzPaymentGateway[]>([])
  const billplzPaymentGateway = ref<BillplzPaymentGateway | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.billplzPaymentGateways, {
    items: billplzPaymentGateways,
    item: billplzPaymentGateway,
    isLoading: isLoading,
    error: error,
  })

  async function fetchGateways(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.billplzPaymentGateways.fetchGateways()
      if (typeof response === "object") {
        billplzPaymentGateways.value = Object.values(response).map((data: any) => {
          return new BillplzPaymentGateway(data)
        })
      }
    } catch (e: any) {
      error.value = e.message || "Failed to fetch billplzPaymentGateways for user"
      console.error(`Fail to fetch billplzPaymentGateways for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalBillplzPaymentGateways = computed(() => billplzPaymentGateways.value.length)

  return {
    billplzPaymentGateways,
    billplzPaymentGateway,
    isLoading,
    error,
    totalBillplzPaymentGateways,
    ...crudActions,
    fetchGateways,
  }
})
