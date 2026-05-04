import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitution } from "~/scripts/models/CompanyConstitution"
import { CompanyConstitutionContent } from "~/scripts/models/CompanyConstitutionContent"

export const useCompanyConstitutionStore = defineStore("companyConstitution", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutions = ref<CompanyConstitution[]>([])
  const companyConstitution = ref<CompanyConstitution | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutions, {
    items: companyConstitutions,
    item: companyConstitution,
    isLoading: isLoading,
    error: error,
  })

  async function byCompanyId(companyId: string): Promise<CompanyConstitution[]> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.byCompanyId(companyId)
      return response.data && Array.isArray(response.data)
        ? response.data.map((d: any) => {
            return new CompanyConstitution(d)
          })
        : []
    } catch (e) {
      console.error("Failed to fetch constitution for company", e)
      error.value = `Failed to fetch constitution for company: ${e}`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function latest(companyId: string): Promise<CompanyConstitution | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.latest(companyId)
      return new CompanyConstitution(response.data) ?? null
    } catch (e) {
      console.error("Failed to fetch constitution for company", e)
      error.value = `Failed to fetch constitution for company: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addContent(data: any): Promise<CompanyConstitutionContent | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.addContent(data)
      return new CompanyConstitutionContent(response.data) ?? null
    } catch (e) {
      console.error("Failed to add content", e)
      error.value = `Failed to add content: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function addMultipleContents(data: any): Promise<CompanyConstitutionContent | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.addMultipleContents(data)
      return new CompanyConstitutionContent(response.data) ?? null
    } catch (e) {
      console.error("Failed to add content", e)
      error.value = `Failed to add content: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteContent(contentId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.deleteContent(contentId)
      return response
    } catch (e) {
      console.error("Failed to remove content", e)
      error.value = `Failed to remove content: ${e}`
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function deleteMultipleContents(data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutions.deleteMultipleContents(data)
      return response
    } catch (e) {
      console.error("Failed to add content", e)
      error.value = `Failed to add content: ${e}`
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentConstitutions = computed(() => companyConstitutions.value.length)

  return {
    companyConstitutions,
    companyConstitution,
    isLoading,
    error,
    totalCompanyAmendmentConstitutions,
    ...crudActions,
    byCompanyId,
    latest,
    addContent,
    addMultipleContents,
    deleteContent,
    deleteMultipleContents,
  }
})
