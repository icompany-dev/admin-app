import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { Filter } from "~/scripts/library/Filter"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { useStoreActions } from "~/stores/StoreActions"
import { Merchandise } from "~/scripts/models/Merchandise"

export const useMerchandiseStore = defineStore("merchandise", () => {
  const { $repositories } = useNuxtApp()

  const merchandises = ref<Merchandise[]>([])
  const merchandise = ref<Merchandise | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.merchandises, {
    items: merchandises,
    item: merchandise,
    isLoading: isLoading,
    error: error,
  })

  async function byTags(tags: string[], filter: Filter): Promise<ApiRecord<Merchandise>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.merchandises.byTags(tags, filter)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch merchandise by tags`
      console.error(`Error to fetch payment history`, e)
      return new ApiRecord<Merchandise>(null, Merchandise)
    } finally {
      isLoading.value = false
    }
  }

  async function byCategory(categoryId: string, filter: Filter): Promise<ApiRecord<Merchandise>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.merchandises.byCategory(categoryId, filter)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch merchandise by tags`
      console.error(`Error to fetch payment history`, e)
      return new ApiRecord<Merchandise>(null, Merchandise)
    } finally {
      isLoading.value = false
    }
  }

  async function byCategoryTags(categoryId: string, tags: string[], filter: Filter): Promise<ApiRecord<Merchandise>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.merchandises.byCategoryTags(categoryId, tags, filter)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch merchandise by tags`
      console.error(`Error to fetch payment history`, e)
      return new ApiRecord<Merchandise>(null, Merchandise)
    } finally {
      isLoading.value = false
    }
  }

  const totalMerchandises = computed(() => merchandises.value.length)

  return {
    merchandises,
    merchandise,
    isLoading,
    error,
    totalMerchandises,
    ...crudActions,
    byTags,
    byCategory,
    byCategoryTags,
  }
})
