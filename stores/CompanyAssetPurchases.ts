import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAssetPurchase } from "~/scripts/models/CompanyAssetPurchase"

export const useCompanyAssetPurchaseStore = defineStore("companyAssetPurchase", () => {
  const { $repositories } = useNuxtApp()

  const companyAssetPurchases = ref<CompanyAssetPurchase[]>([])
  const companyAssetPurchase = ref<CompanyAssetPurchase | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAssetPurchases, {
    items: companyAssetPurchases,
    item: companyAssetPurchase,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAssetPurchases = computed(() => companyAssetPurchases.value.length)

  return {
    companyAssetPurchases,
    companyAssetPurchase,
    isLoading,
    error,
    totalCompanyAssetPurchases,
    ...crudActions
  }
})
