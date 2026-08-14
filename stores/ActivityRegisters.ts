import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { ActivityRegister } from "~/scripts/models/ActivityRegister"

export const useActivityRegisterStore = defineStore("activityRegister", () => {
  const { $repositories } = useNuxtApp()

  const activityRegisters = ref<ActivityRegister[]>([])
  const activityRegister = ref<ActivityRegister | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.activityRegisters, {
    items: activityRegisters,
    item: activityRegister,
    isLoading: isLoading,
    error: error,
  })

  const totalActivityRegisters = computed(() => activityRegisters.value.length)

  return {
    activityRegisters,
    activityRegister,
    isLoading,
    error,
    totalActivityRegisters,
    ...crudActions
  }
})
