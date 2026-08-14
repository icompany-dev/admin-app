import { defineStore } from "pinia"
import { AdminSetting } from "~/scripts/models/AdminSetting"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useAdminSettingStore = defineStore("adminSetting", () => {
  const { $repositories } = useNuxtApp()

  const adminSettings = ref<AdminSetting[]>([])
  const adminSetting = ref<AdminSetting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.adminSettings, {
    items: adminSettings,
    item: adminSetting,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllOld(slug: string | null): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      adminSettings.value = []
      const response: any = await $repositories.adminSettings.fetchAllOld(slug)
      if (response.data) {
        adminSettings.value.push(new AdminSetting(response.data))
      }
    } catch (e: any) {
      error.value = e.message || `Failed to fetch adminSettings for company`
      console.error(`Error to fetch adminSettings by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalAdminSettings = computed(() => adminSettings.value.length)

  return {
    adminSettings,
    adminSetting,
    isLoading,
    error,
    totalAdminSettings,
    ...crudActions,
    fetchAllOld,
  }
})
