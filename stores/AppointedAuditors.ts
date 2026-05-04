import { defineStore } from "pinia"
import type { AppointedAuditor } from "~/scripts/models/AppointedAuditor"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAppointedAuditorStore = defineStore("appointedAuditor", () => {
  const { $repositories } = useNuxtApp()

  const appointedAuditors = ref<AppointedAuditor[]>([])
  const appointedAuditor = ref<AppointedAuditor | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.appointedAuditors, {
    items: appointedAuditors,
    item: appointedAuditor,
    isLoading: isLoading,
    error: error,
  })

  const totalAppointedAuditors = computed(() => appointedAuditors.value.length)

  return {
    appointedAuditors,
    appointedAuditor,
    isLoading,
    error,
    totalAppointedAuditors,
    ...crudActions,
  }
})
