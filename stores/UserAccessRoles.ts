import { defineStore } from "pinia"
import type { UserAccessRole } from "~/scripts/models/UserAccessRole"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useUserAccessRoleStore = defineStore("userAccessRole", () => {
  const { $repositories } = useNuxtApp()

  const userAccessRoles = ref<UserAccessRole[]>([])
  const userAccessRole = ref<UserAccessRole | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.userAccessRoles, {
    items: userAccessRoles,
    item: userAccessRole,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllForCompany(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRoles.fetchAllForCompany(companyId)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRoles for company`
      console.error(`Error to fetch userAccessRoles by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalUserAccessRoles = computed(() => userAccessRoles.value.length)

  return {
    userAccessRoles,
    userAccessRole,
    isLoading,
    error,
    totalUserAccessRoles,
    ...crudActions,
    fetchAllForCompany,
  }
})
