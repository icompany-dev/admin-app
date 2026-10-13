import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"

export const useCompanySwitchOutStore = defineStore("companySwitchOut", () => {
  const { $repositories } = useNuxtApp()

  const companySwitchOuts = ref<CompanySwitchOut[]>([])
  const companySwitchOut = ref<CompanySwitchOut | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companySwitchOuts, {
    items: companySwitchOuts,
    item: companySwitchOut,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanySwitchOuts = computed(() => companySwitchOuts.value.length)

  return {
    companySwitchOuts,
    companySwitchOut,
    isLoading,
    error,
    totalCompanySwitchOuts,
    ...crudActions
  }
})
