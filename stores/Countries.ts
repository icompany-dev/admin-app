import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { Country } from "~/scripts/models/Location"

export const useCountryStore = defineStore("country", () => {
  const { $repositories } = useNuxtApp()
  const countries = ref<Country[]>([])
  const country = ref<Country | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.countries, {
    items: countries,
    item: country,
    isLoading: isLoading,
    error: error,
  })

  const totalCountries = computed(() => countries.value.length)

  return {
    countries,
    country,
    isLoading,
    error,
    totalCountries,
    ...crudActions,
  }
})
