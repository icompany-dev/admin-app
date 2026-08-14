import { defineStore } from "pinia"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useDirectorInvitationStore = defineStore("directorInvitation", () => {
  const { $repositories } = useNuxtApp()

  const directorInvitations = ref<DirectorInvitation[]>([])
  const directorInvitation = ref<DirectorInvitation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.directorInvitations, {
    items: directorInvitations,
    item: directorInvitation,
    isLoading: isLoading,
    error: error,
  })

  const totalDirectorInvitations = computed(() => directorInvitations.value.length)

  async function all(): Promise<DirectorInvitation[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.directorInvitations.all()
      const invitations = (response.data || []).map((item: any) => new DirectorInvitation(item))
      directorInvitations.value = invitations
      return invitations
    } catch (e: any) {
      error.value = e.message || "Failed to fetch director invitations."
      console.error("Error in all:", e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function accept(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.directorInvitations.accept(id)
      return response
    } catch (e: any) {
      error.value = e.message || "Failed to accept director invitation."
      console.error(`Error in accept(${id}):`, e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function reject(id: string, reason?: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.directorInvitations.reject(id, { reason })
      return response
    } catch (e: any) {
      error.value = e.message || "Failed to reject director invitation."
      console.error(`Error in reject(${id}):`, e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    directorInvitations,
    directorInvitation,
    isLoading,
    error,
    totalDirectorInvitations,
    ...crudActions,
    all,
    accept,
    reject,
  }
})
