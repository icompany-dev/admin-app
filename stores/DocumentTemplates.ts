import { defineStore } from "pinia"
import type { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useDocumentTemplateStore = defineStore("documentTemplate", () => {
  const { $repositories } = useNuxtApp()

  const documentTemplates = ref<DocumentTemplate[]>([])
  const documentTemplate = ref<DocumentTemplate | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.documentTemplates, {
    items: documentTemplates,
    item: documentTemplate,
    isLoading: isLoading,
    error: error,
  })

  const totalDocumentTemplates = computed(() => documentTemplates.value.length)

  return {
    documentTemplates,
    documentTemplate,
    isLoading,
    error,
    totalDocumentTemplates,
    ...crudActions,
  }
})
