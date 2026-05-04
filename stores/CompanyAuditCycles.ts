import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAuditCycle } from "~/scripts/models/CompanyAuditCycle"

export const useCompanyAuditCycleStore = defineStore("companyAuditCycle", () => {
  const { $repositories } = useNuxtApp()

  const companyAuditCycles = ref<CompanyAuditCycle[]>([])
  const companyAuditCycle = ref<CompanyAuditCycle | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAuditCycles, {
    items: companyAuditCycles,
    item: companyAuditCycle,
    isLoading: isLoading,
    error: error,
  })

  async function current(companyId: string): Promise<CompanyAuditCycle | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAuditCycles.current(companyId)
      return new CompanyAuditCycle(response)
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function markOngoing(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAuditCycles.markOngoing(id)
      return response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByFinancialYearEnd(companyId: string, fyeDate: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAuditCycles.fetchByFinancialYearEnd(companyId, fyeDate)
      return response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAuditCycles = computed(() => companyAuditCycles.value.length)

  return {
    companyAuditCycles,
    companyAuditCycle,
    isLoading,
    error,
    totalCompanyAuditCycles,
    ...crudActions,
    current,
    markOngoing,
    fetchByFinancialYearEnd,
  }
})
