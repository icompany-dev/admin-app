import { defineStore } from "pinia"
import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyBODeclarationStore = defineStore("companyBODeclaration", () => {
  const { $repositories } = useNuxtApp()

  const companyBODeclarations = ref<CompanyBODeclaration[]>([])
  const companyBODeclaration = ref<CompanyBODeclaration | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyBODeclarations, {
    items: companyBODeclarations,
    item: companyBODeclaration,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByCompanyId(companyId: string): Promise<CompanyBODeclaration[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.fetchByCompanyId(companyId)
      const declarations = Array.isArray(response) ? response.map((d: any) => new CompanyBODeclaration(d)) : []
      companyBODeclarations.value = declarations
      return declarations
    } catch (e: any) {
      error.value = e.message || "Failed to fetch BO declarations for company"
      console.error("Error fetching BO declarations by company ID", e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function isRequiredForCompany(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.isRequiredForCompany(companyId)
      return response?.is_required === true || response?.is_required === 1
    } catch (e: any) {
      error.value = e.message || "Failed to check if BO declaration is required"
      console.error("Error checking if BO declaration required", e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByShareholderId(shareholderId: string): Promise<CompanyBODeclaration | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.fetchByShareholderId(shareholderId)
      const declaration = response ? new CompanyBODeclaration(response) : null
      companyBODeclaration.value = declaration
      return declaration
    } catch (e: any) {
      error.value = e.message || "Failed to fetch BO declaration for shareholder"
      console.error("Error fetching BO declaration by shareholder ID", e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function incompleteDeclarations(): Promise<any[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.incompleteDeclarations()
      return Array.isArray(response) ? response : []
    } catch (e: any) {
      error.value = e.message || "Failed to fetch companies with incomplete declarations"
      console.error("Error fetching incomplete declarations", e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchForExternal(id: string, emailAddress: string): Promise<CompanyBODeclaration | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.fetchForExternal(id, emailAddress)
      const declaration = response ? new CompanyBODeclaration(response) : null
      companyBODeclaration.value = declaration
      return declaration
    } catch (e: any) {
      error.value = e.message || "Failed to fetch BO declaration for external user"
      console.error("Error fetching BO declaration for external", e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateForExternal(id: string, data: any): Promise<CompanyBODeclaration | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.updateForExternal(id, data)
      const declaration = response ? new CompanyBODeclaration(response) : null
      companyBODeclaration.value = declaration
      return declaration
    } catch (e: any) {
      error.value = e.message || "Failed to update BO declaration for external user"
      console.error("Error updating BO declaration for external", e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPast(companyId: string): Promise<CompanyBODeclaration[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBODeclarations.fetchPast(companyId)
      return response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch BO declarations for company"
      console.error("Error fetching BO declarations by company ID", e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalDeclarations = computed(() => companyBODeclarations.value.length)

  return {
    companyBODeclarations,
    companyBODeclaration,
    isLoading,
    error,
    totalDeclarations,
    ...crudActions,
    fetchByCompanyId,
    isRequiredForCompany,
    fetchByShareholderId,
    incompleteDeclarations,
    fetchForExternal,
    updateForExternal,
    fetchPast,
  }
})
