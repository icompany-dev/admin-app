import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"

export const useMsicCodeAssignStore = defineStore("msicCodeAssign", () => {
  const { $repositories } = useNuxtApp()

  const msicCodeAssigns = ref<MsicCodeAssign[]>([])
  const msicCodeAssign = ref<MsicCodeAssign | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.msicCodeAssigns, {
    items: msicCodeAssigns,
    item: msicCodeAssign,
    isLoading: isLoading,
    error: error,
  })

  const totalMsicCodeAssigns = computed(() => msicCodeAssigns.value.length)

  return {
    msicCodeAssigns,
    msicCodeAssign,
    isLoading,
    error,
    totalMsicCodeAssigns,
    ...crudActions
  }
})
