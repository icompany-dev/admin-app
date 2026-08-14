import { defineStore } from "pinia"
import type { CompanyMailroomService } from "~/scripts/models/CompanyMailroomService"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyMailroomServiceStore = defineStore("companyMailroomService", () => {
  const { $repositories } = useNuxtApp()

  const companyMailroomServices = ref<CompanyMailroomService[]>([])
  const companyMailroomService = ref<CompanyMailroomService | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyMailroomServices, {
    items: companyMailroomServices,
    item: companyMailroomService,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyMailroomServices = computed(() => companyMailroomServices.value.length)

  async function hasUnclaimedMails(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyMailroomServices.hasUnclaimedMails(companyId)
      return response.has_unclaimed_mail
    } catch (e: any) {
      error.value = e.message || "Failed to check for unclaimed mails."
      console.error(`Error checking unclaimed mails for company ${companyId}:`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    companyMailroomServices,
    companyMailroomService,
    isLoading,
    error,
    totalCompanyMailroomServices,
    ...crudActions,
    hasUnclaimedMails,
  }
})
