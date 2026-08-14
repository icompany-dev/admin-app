import { defineStore } from "pinia"
import { AccessRoleRule } from "~/scripts/models/AccessRoleRule"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAccessRoleRuleStore = defineStore("accessRoleRule", () => {
  const { $repositories } = useNuxtApp()

  const accessRoleRules = ref<AccessRoleRule[]>([])
  const accessRoleRule = ref<AccessRoleRule | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.accessRoleRules, {
    items: accessRoleRules,
    item: accessRoleRule,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByRoleId(accessRoleId: string): Promise<any | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.accessRoleRules.fetchByAccessRoleId(accessRoleId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch access rules for role`
      console.error(`Error to fetch access rules by role id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addRulesToRole(data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.accessRoleRules.addRulesToRole(data)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to update rules`
      console.error(`Error to add rules to role`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalAccessRoleRules = computed(() => accessRoleRules.value.length)

  return {
    accessRoleRules,
    accessRoleRule,
    isLoading,
    error,
    totalAccessRoleRules,
    ...crudActions,
    fetchByRoleId,
    addRulesToRole,
  }
})
