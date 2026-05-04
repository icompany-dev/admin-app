import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"

export const useCompanyShareIssuanceStore = defineStore("companyShareIssuance", () => {
  const { $repositories } = useNuxtApp()

  const companyShareIssuances = ref<CompanyShareIssuance[]>([])
  const companyShareIssuance = ref<CompanyShareIssuance | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyShareIssuances, {
    items: companyShareIssuances,
    item: companyShareIssuance,
    isLoading: isLoading,
    error: error,
  })

  async function initiate(data: any): Promise<CompanyShareIssuance | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.initiate(data)
      return new CompanyShareIssuance(response.data)
    } catch (e: any) {
      console.error(`Failed to initiate new Section 85 PRN`, e)
      error.value = `Failed to initiate new Section 85 PRN`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function hasOngoing(companyId: string, shareType: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.hasOngoing(companyId, shareType)
      return response.has_ongoing ?? false
    } catch (e: any) {
      console.error(`Failed to check for ongoing applications`, e)
      error.value = `Failed to check for ongoing applications`
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function allOngoing(companyId: string, shareType: string): Promise<CompanyShareIssuance[]> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.allOngoing(companyId, shareType)
      if (!response.data) {
        return []
      }

      return response.data.map((r: any) => {
        return new CompanyShareIssuance(r)
      })
    } catch (e: any) {
      console.error(`Failed to fetch all ongoing applications`, e)
      error.value = `Failed to fetch all ongoing applications`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function respond(id: string, data: any): Promise<CompanyShareIssuance | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.respond(id, data)
      return new CompanyShareIssuance(response.data)
    } catch (e: any) {
      console.error(`Failed to respond to Section 85 PRN`, e)
      error.value = `Failed to respond to Section 85 PRN`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchToProceed(companyId: string): Promise<CompanyShareIssuance[]> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.fetchToProceed(companyId)
      if (!response.data) {
        return []
      }

      return response.data.map((r: any) => {
        return new CompanyShareIssuance(r)
      })
    } catch (e: any) {
      console.error(`Failed to fetch applicationss to proceed`, e)
      error.value = `Failed to fetch applicationss to proceed`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function canProceed(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.canProceed(id)
      return response
    } catch (e: any) {
      console.error(`Failed to check Section 85 PRN to proceed`, e)
      error.value = `Failed to check Section 85 PRN to proceed`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function issue(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.issue(id)
      return response
    } catch (e: any) {
      console.error(`Failed to proceed to issue Section 85 PRN`, e)
      error.value = `Failed to proceed to issue Section 85 PRN`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function declaration(id: string, data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareIssuances.declaration(id, data)
      return response
    } catch (e: any) {
      console.error(`Failed to check Section 85 PRN to proceed`, e)
      error.value = `Failed to check Section 85 PRN to proceed`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyShareIssuances = computed(() => companyShareIssuances.value.length)

  return {
    companyShareIssuances,
    companyShareIssuance,
    isLoading,
    error,
    totalCompanyShareIssuances,
    ...crudActions,
    initiate,
    hasOngoing,
    allOngoing,
    respond,
    fetchToProceed,
    canProceed,
    issue,
    declaration,
  }
})
