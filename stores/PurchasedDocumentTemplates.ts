import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { PurchasedDocumentTemplate } from "~/scripts/models/PurchasedDocumentTemplate"

export const usePurchasedDocumentTemplateStore = defineStore("purchasedDocumentTemplate", () => {
  const { $repositories } = useNuxtApp()

  const purchasedDocumentTemplates = ref<PurchasedDocumentTemplate[]>([])
  const purchasedDocumentTemplate = ref<PurchasedDocumentTemplate | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.purchasedDocumentTemplates, {
    items: purchasedDocumentTemplates,
    item: purchasedDocumentTemplate,
    isLoading: isLoading,
    error: error,
  })

  const totalPurchasedDocumentTemplates = computed(() => purchasedDocumentTemplates.value.length)

  return {
    purchasedDocumentTemplates,
    purchasedDocumentTemplate,
    isLoading,
    error,
    totalPurchasedDocumentTemplates,
    ...crudActions,
  }
})
