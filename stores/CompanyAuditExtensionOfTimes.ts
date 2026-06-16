import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAuditExtensionOfTime } from "~/scripts/models/CompanyAuditExtensionOfTime"

export const useCompanyAuditExtensionOfTimeStore = defineStore("companyAuditExtensionOfTime", () => {
  const { $repositories } = useNuxtApp()

  const companyAuditExtensionOfTimes = ref<CompanyAuditExtensionOfTime[]>([])
  const companyAuditExtensionOfTime = ref<CompanyAuditExtensionOfTime | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAuditExtensionOfTimes, {
    items: companyAuditExtensionOfTimes,
    item: companyAuditExtensionOfTime,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByCompany(companyId: string): Promise<CompanyAuditExtensionOfTime[]> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyAuditExtensionOfTimes.fetchByCompany(companyId)
      companyAuditExtensionOfTimes.value = response.map((item: any) => new CompanyAuditExtensionOfTime(item))
      return companyAuditExtensionOfTimes.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function submit(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyAuditExtensionOfTimes.submit(id)
      if (companyAuditExtensionOfTime.value?.id === id) {
        companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(response)
      }
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function pay(id: string, data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyAuditExtensionOfTimes.pay(id, data)
      if (companyAuditExtensionOfTime.value?.id === id) {
        companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(response)
      }
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approve(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyAuditExtensionOfTimes.approve(id)
      if (companyAuditExtensionOfTime.value?.id === id) {
        companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(response)
      }
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function reject(id: string, data: any): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyAuditExtensionOfTimes.reject(id, data)
      if (companyAuditExtensionOfTime.value?.id === id) {
        companyAuditExtensionOfTime.value = new CompanyAuditExtensionOfTime(response)
      }
      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    companyAuditExtensionOfTimes,
    companyAuditExtensionOfTime,
    isLoading,
    error,
    ...crudActions,
    fetchByCompany,
    submit,
    pay,
    approve,
    reject
  }
})
