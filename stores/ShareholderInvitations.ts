import { defineStore } from "pinia"
import type { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useShareholderInvitationStore = defineStore("shareholderInvitation", () => {
  const { $repositories } = useNuxtApp()

  const shareholderInvitations = ref<ShareholderInvitation[]>([])
  const shareholderInvitation = ref<ShareholderInvitation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.shareholderInvitations, {
    items: shareholderInvitations,
    item: shareholderInvitation,
    isLoading: isLoading,
    error: error,
  })

  const totalShareholderInvitations = computed(() => shareholderInvitations.value.length)

  return {
    shareholderInvitations,
    shareholderInvitation,
    isLoading,
    error,
    totalShareholderInvitations,
    ...crudActions,
  }
})
