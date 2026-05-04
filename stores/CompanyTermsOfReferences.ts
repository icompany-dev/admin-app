import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyTermOfReference } from "~/scripts/models/CompanyTermOfReference"

export const useCompanyTermOfReferenceStore = defineStore("companyTermOfReference", () => {
  const { $repositories } = useNuxtApp()

  const companyTermOfReferences = ref<CompanyTermOfReference[]>([])
  const companyTermOfReference = ref<CompanyTermOfReference | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyTermOfReferences, {
    items: companyTermOfReferences,
    item: companyTermOfReference,
    isLoading: isLoading,
    error: error,
  })

  async function hasExisting(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyTermOfReferences.hasExistingTor(companyId)
      return response.has_existing ?? false
    } catch (e) {
      console.error(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyTermOfReferences = computed(() => companyTermOfReferences.value.length)

  return {
    companyTermOfReferences,
    companyTermOfReference,
    isLoading,
    error,
    totalCompanyTermOfReferences,
    ...crudActions,
    hasExisting,
  }
})
