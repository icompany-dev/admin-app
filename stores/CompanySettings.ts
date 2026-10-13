import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanySetting } from "~/scripts/models/CompanySetting"

export const useCompanySettingStore = defineStore("companySetting", () => {
  const { $repositories } = useNuxtApp()

  const companySettings = ref<CompanySetting[]>([])
  const companySetting = ref<CompanySetting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companySettings, {
    items: companySettings,
    item: companySetting,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanySettings = computed(() => companySettings.value.length)

  return {
    companySettings,
    companySetting,
    isLoading,
    error,
    totalCompanySettings,
    ...crudActions
  }
})
