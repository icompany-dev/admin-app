import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { Company } from "~/scripts/models/Company"

export const useCompanyStore = defineStore("company", () => {
  const { $repositories } = useNuxtApp()

  const companies = ref<Company[]>([])
  const company = ref<Company | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companies, {
    items: companies,
    item: company,
    isLoading: isLoading,
    error: error,
  })

  async function isSwitched(id: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companies.isSwitched(id)
      return response.is_switched
    } catch (e: any) {
      console.error(`Error to check isSwitched`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function canOpenBankAccount(id: string): Promise<object> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companies.canOpenBankAccount(id)
      return response
    } catch (e: any) {
      console.error(`Error to check isSwitched`, e)
      return {}
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCompact(slug: string | null = null): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companies.fetchCompact(slug)
      companies.value = response.data.map((d: any) => {
        return new Company(d)
      })
      return response.data
    } catch (e: any) {
      console.error(`Error to check isSwitched`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function updateDetails(id: string, data: any): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companies.updateDetails(id, data)
      company.value = new Company(response.data)
    } catch (e: any) {
      error.value = `Unable to update company. ${e}`
      console.error("Failed to update company", e)
    }
  }

  async function fetchPublic(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companies.fetchPublic(id)
      return response.data
    } catch (e: any) {
      console.error(`Error to check isSwitched`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanies = computed(() => companies.value.length)

  return {
    companies,
    company,
    isLoading,
    error,
    totalCompanies,
    ...crudActions,
    isSwitched,
    canOpenBankAccount,
    fetchCompact,
    updateDetails,
    fetchPublic,
  }
})
