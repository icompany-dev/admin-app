import { defineStore } from "pinia"
import { AccessRule } from "~/scripts/models/AccessRule"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAccessRuleStore = defineStore("accessRule", () => {
  const { $repositories } = useNuxtApp()

  const accessRules = ref<AccessRule[]>([])
  const accessRule = ref<AccessRule | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.accessRules, {
    items: accessRules,
    item: accessRule,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByServices(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.accessRules.fetchByServices()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to update rules`
      console.error(`Error to add rules to role`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalAccessRules = computed(() => accessRules.value.length)

  return {
    accessRules,
    accessRule,
    isLoading,
    error,
    totalAccessRules,
    ...crudActions,
    fetchByServices,
  }
})
