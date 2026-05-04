import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { State } from "~/scripts/models/Location"

export const useStateStore = defineStore("state", () => {
  const { $repositories } = useNuxtApp()
  const states = ref<State[]>([])
  const state = ref<State | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.states, {
    items: states,
    item: state,
    isLoading: isLoading,
    error: error,
  })

  async function byCountryId(countryId: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.states.byCountryId(countryId)
      states.value = response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch states for user"
      console.error(`Fail to fetch states for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalStates = computed(() => states.value.length)

  return {
    states,
    state,
    isLoading,
    error,
    totalStates,
    ...crudActions,
    byCountryId,
  }
})
