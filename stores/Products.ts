import { defineStore } from "pinia"
import type { Product } from "~/scripts/models/Product"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useProductStore = defineStore("product", () => {
  const { $repositories } = useNuxtApp()

  const products = ref<Product[]>([])
  const product = ref<Product | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.products, {
    items: products,
    item: product,
    isLoading: isLoading,
    error: error,
  })

  async function byIds(ids: string[]): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.products.byIds(ids)
      products.value = response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch products for user"
      console.error(`Fail to fetch products for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function documentTemplates(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.products.documentTemplates()
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch products for user"
      console.error(`Fail to fetch products for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalProducts = computed(() => products.value.length)

  return {
    products,
    product,
    isLoading,
    error,
    totalProducts,
    ...crudActions,
    byIds,
    documentTemplates: documentTemplates,
  }
})
