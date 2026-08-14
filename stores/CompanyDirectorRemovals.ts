import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"

export const useCompanyDirectorRemovalStore = defineStore("companyDirectorRemoval", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorRemovals = ref<CompanyDirectorRemoval[]>([])
  const companyDirectorRemoval = ref<CompanyDirectorRemoval | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorRemovals, {
    items: companyDirectorRemovals,
    item: companyDirectorRemoval,
    isLoading: isLoading,
    error: error,
  })

  async function sendOutNotice(id: string, cosecName: string, cosecLicense: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyDirectorRemovals.sendOutNotice(id, cosecName, cosecLicense)
      return response
    } catch (e) {
      error.value = `Failed to send out notice`
      console.error(error.value, e)
      return 0
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyDirectorRemovals = computed(() => companyDirectorRemovals.value.length)

  return {
    companyDirectorRemovals,
    companyDirectorRemoval,
    isLoading,
    error,
    totalCompanyDirectorRemovals,
    ...crudActions,
    sendOutNotice,
  }
})
