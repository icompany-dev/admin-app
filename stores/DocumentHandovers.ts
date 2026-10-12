import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { DocumentHandover } from "~/scripts/models/DocumentHandover"

export const useDocumentHandoverStore = defineStore("documentHandover", () => {
  const { $repositories } = useNuxtApp()

  const documentHandovers = ref<DocumentHandover[]>([])
  const documentHandover = ref<DocumentHandover | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.documentHandovers, {
    items: documentHandovers,
    item: documentHandover,
    isLoading: isLoading,
    error: error,
  })

  const totalDocumentHandovers = computed(() => documentHandovers.value.length)

  return {
    documentHandovers,
    documentHandover,
    isLoading,
    error,
    totalDocumentHandovers,
    ...crudActions
  }
})
