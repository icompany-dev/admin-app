import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { Label } from "~/scripts/models/Label"

export const useLabelStore = defineStore("label", () => {
  const { $repositories } = useNuxtApp()

  const labels = ref<Label[]>([])
  const label = ref<Label | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.labels, {
    items: labels,
    item: label,
    isLoading: isLoading,
    error: error,
  })

  async function fetchItemsForLabel(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.labels.fetchItemsForLabel(id)
      return response
    } catch (e) {
      error.value = `Failed to fetch all items for label: ${e}`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchForServicePricings(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.labels.fetchForServicePricings()
      return response
    } catch (e) {
      error.value = `Failed to fetch for service pricings: ${e}`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function addItem(data: object): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.labels.addItem(data)
      return response.data ?? null
    } catch (e) {
      error.value = `Failed to add label to target: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteItem(itemId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.labels.deleteItem(itemId)
      return response
    } catch (e) {
      error.value = `Failed to delete label for target: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalLabels = computed(() => labels.value.length)

  return {
    labels,
    label,
    isLoading,
    error,
    totalLabels,
    ...crudActions,
    fetchItemsForLabel,
    addItem,
    deleteItem,
    fetchForServicePricings,
  }
})
