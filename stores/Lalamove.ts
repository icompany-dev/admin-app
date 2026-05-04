import { defineStore } from "pinia"
import { DeliveryData, DeliveryDataDetails, DeliveryDataDetailsStops } from "~/scripts/models/DeliveryData"
import { useNuxtApp } from "#app"

export const useLalamoveStore = defineStore("lalamove", () => {
  const { $repositories } = useNuxtApp()

  const deliveryDatas = ref<DeliveryData[]>([])
  const deliveryData = ref<DeliveryData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function rates(
    scheduleAt: string,
    from: DeliveryDataDetailsStops,
    to: DeliveryDataDetailsStops
  ): Promise<DeliveryData | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: DeliveryData = await $repositories.lalamove.rates(scheduleAt, from, to)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch rates`
      console.error(`Error to fetch rates`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalDeliveryDatas = computed(() => deliveryDatas.value.length)

  return {
    deliveryDatas,
    deliveryData,
    isLoading,
    error,
    totalDeliveryDatas,
    rates,
  }
})
