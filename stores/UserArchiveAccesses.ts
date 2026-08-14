import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { UserArchiveAccess } from "~/scripts/models/UserArchiveAccess"

export const useUserArchiveAccessStore = defineStore("userArchiveAccess", () => {
  const { $repositories } = useNuxtApp()

  const userArchiveAccesss = ref<UserArchiveAccess[]>([])
  const userArchiveAccess = ref<UserArchiveAccess | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.userArchiveAccesses, {
    items: userArchiveAccesss,
    item: userArchiveAccess,
    isLoading: isLoading,
    error: error,
  })

  async function hasAccess(type: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userArchiveAccesses.hasAccess(type)
      return response.has_access ? response.has_access : false
    } catch (e: any) {
      console.error(`Error to check has access to archives`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalUserArchiveAccesss = computed(() => userArchiveAccesss.value.length)

  return {
    userArchiveAccesss,
    userArchiveAccess,
    isLoading,
    error,
    totalUserArchiveAccesss,
    ...crudActions,
    hasAccess,
  }
})
