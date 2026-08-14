import { defineStore } from "pinia"
import type { UserAccessRule } from "~/scripts/models/UserAccessRule"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useUserAccessRuleStore = defineStore("userAccessRule", () => {
  const { $repositories } = useNuxtApp()

  const userAccessRules = ref<UserAccessRule[]>([])
  const userAccessRule = ref<UserAccessRule | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.userAccessRules, {
    items: userAccessRules,
    item: userAccessRule,
    isLoading: isLoading,
    error: error,
  })

  async function byAccessRule(userId: string, companyId: string, accessRuleId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRules.byAccessRule(userId, companyId, accessRuleId)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRules for company`
      console.error(`Error to fetch userAccessRules by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function forUserCompany(userId: string, companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRules.forUserCompany(userId, companyId)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRules for company`
      console.error(`Error to fetch userAccessRules by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function accessRulesForUser(userId: string, companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRules.accessRulesForUser(userId, companyId)
      return response ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRules for company`
      console.error(`Error to fetch userAccessRules by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function createMultiple(data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRules.createMultiple(data)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRules for company`
      console.error(`Error to fetch userAccessRules by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function updateMultiple(data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.userAccessRules.updateMultiple(data)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch userAccessRules for company`
      console.error(`Error to fetch userAccessRules by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalUserAccessRules = computed(() => userAccessRules.value.length)

  return {
    userAccessRules,
    userAccessRule,
    isLoading,
    error,
    totalUserAccessRules,
    ...crudActions,
    byAccessRule,
    forUserCompany,
    accessRulesForUser,
    createMultiple,
    updateMultiple,
  }
})
