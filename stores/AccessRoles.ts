import { defineStore } from "pinia"
import { AccessRole } from "~/scripts/models/AccessRole"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAccessRoleStore = defineStore("accessRole", () => {
  const { $repositories } = useNuxtApp()

  const accessRoles = ref<AccessRole[]>([])
  const accessRole = ref<AccessRole | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.accessRoles, {
    items: accessRoles,
    item: accessRole,
    isLoading: isLoading,
    error: error,
  })

  const totalAccessRoles = computed(() => accessRoles.value.length)

  return {
    accessRoles,
    accessRole,
    isLoading,
    error,
    totalAccessRoles,
    ...crudActions,
  }
})
