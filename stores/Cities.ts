import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { City } from "~/scripts/models/Location"
import type { Filter } from "~/scripts/library/Filter"

export const useCityStore = defineStore("city", () => {
  const { $repositories } = useNuxtApp()
  const cities = ref<City[]>([])
  const city = ref<City | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.cities, {
    items: cities,
    item: city,
    isLoading: isLoading,
    error: error,
  })

  async function search(filter: Filter): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.cities.search(filter)
      cities.value = response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch cities for user"
      console.error(`Fail to fetch cities for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function byStateId(stateId: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.cities.byStateId(stateId)
      cities.value = response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch cities for user"
      console.error(`Fail to fetch cities for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalCities = computed(() => cities.value.length)

  return {
    cities,
    city,
    isLoading,
    error,
    totalCities,
    ...crudActions,
    search,
    byStateId,
  }
})
