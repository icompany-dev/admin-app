import { defineStore } from "pinia"
import { UserInvitation } from "~/scripts/models/UserInvitation"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useUserInvitationStore = defineStore("userInvitation", () => {
  const { $repositories } = useNuxtApp()

  const userInvitations = ref<UserInvitation[]>([])
  const userInvitation = ref<UserInvitation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.userInvitations, {
    items: userInvitations,
    item: userInvitation,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByUserId(userId: string): Promise<UserInvitation[]> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userInvitations.fetchByUserId(userId)
      return response.data.map((d: any) => {
        return new UserInvitation(d)
      })
    } catch (e: any) {
      error.value = e.message || `Failed to fetch invitation for user`
      console.error(`Error to fetch invitation for user`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function accept(id: string): Promise<UserInvitation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userInvitations.accept(id)
      return new UserInvitation(response)
    } catch (e: any) {
      error.value = e.message || `Failed to accept invitation`
      console.error(`Error to accept invitation`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function reject(id: string): Promise<UserInvitation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userInvitations.reject(id)
      return new UserInvitation(response)
    } catch (e: any) {
      error.value = e.message || `Failed to accept invitation`
      console.error(`Error to accept invitation`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalUserInvitations = computed(() => userInvitations.value.length)

  return {
    userInvitations,
    userInvitation,
    isLoading,
    error,
    totalUserInvitations,
    ...crudActions,
    fetchByUserId,
    accept,
    reject,
  }
})
