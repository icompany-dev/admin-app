import { defineStore } from "pinia"
import type { Form } from "~/scripts/models/Form"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import type { Filter } from "~/scripts/library/Filter"
import type { ApiRecord } from "~/scripts/library/ApiRecord"

export const useFormStore = defineStore("form", () => {
  const { $repositories } = useNuxtApp()

  const forms = ref<Form[]>([])
  const form = ref<Form | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.forms, {
    items: forms,
    item: form,
    isLoading: isLoading,
    error: error,
  })

  async function searchFetchAll(filter: Filter): Promise<Form[]> {
    isLoading.value = true
    error.value = null

    try {
      const response: ApiRecord<Form> = await $repositories.forms.searchFetchAll(filter)
      return response.data
    } catch (e: any) {
      error.value = e.message || `Failed to fetch forms for company`
      console.error(`Error to fetch forms by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function formDownload(id: string, fileId: string | null = null): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: Form = await $repositories.forms.formDownload(id, fileId)
      form.value = response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch forms for company`
      console.error(`Error to fetch forms by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalForms = computed(() => forms.value.length)

  return {
    forms,
    form,
    isLoading,
    error,
    totalForms,
    ...crudActions,
    searchFetchAll,
    formDownload,
  }
})
