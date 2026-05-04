import { defineStore } from "pinia"
import type { AuditorInvitation } from "~/scripts/models/AuditorInvitation"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAuditorInvitationStore = defineStore("auditorInvitation", () => {
  const { $repositories } = useNuxtApp()

  const auditorInvitations = ref<AuditorInvitation[]>([])
  const auditorInvitation = ref<AuditorInvitation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.auditorInvitations, {
    items: auditorInvitations,
    item: auditorInvitation,
    isLoading: isLoading,
    error: error,
  })

  const totalAuditorInvitations = computed(() => auditorInvitations.value.length)

  return {
    auditorInvitations,
    auditorInvitation,
    isLoading,
    error,
    totalAuditorInvitations,
    ...crudActions,
  }
})
