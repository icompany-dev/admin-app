import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { FormType } from "~/scripts/models/FormType"

export const useFormTypeStore = defineStore("formType", () => {
  const { $repositories } = useNuxtApp()

  const formTypes = ref<FormType[]>([])
  const formType = ref<FormType | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.formTypes, {
    items: formTypes,
    item: formType,
    isLoading: isLoading,
    error: error,
  })

  const totalFormTypes = computed(() => formTypes.value.length)

  return {
    formTypes,
    formType,
    isLoading,
    error,
    totalFormTypes,
    ...crudActions
  }
})
