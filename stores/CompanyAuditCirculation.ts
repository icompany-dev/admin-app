import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"

export const useCompanyAuditCirculationStore = defineStore("companyAuditCirculation", () => {
  const { $repositories } = useNuxtApp()

  const companyAuditCirculations = ref<CompanyAuditCirculation[]>([])
  const companyAuditCirculation = ref<CompanyAuditCirculation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAuditCirculations, {
    items: companyAuditCirculations,
    item: companyAuditCirculation,
    isLoading: isLoading,
    error: error,
  })

  async function byFinancialPeriod(
    companyId: string,
    financialPeriodId: string
  ): Promise<CompanyAuditCirculation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAuditCirculations.byFinancialPeriod(companyId, financialPeriodId)
      return new CompanyAuditCirculation(response)
    } catch (e: any) {
      console.error(`Error to fetch ongoing`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function byAuditCycle(id: string): Promise<CompanyAuditCirculation | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAuditCirculations.byAuditCycle(id)
      return new CompanyAuditCirculation(response)
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAuditCirculations = computed(() => companyAuditCirculations.value.length)

  return {
    companyAuditCirculations,
    companyAuditCirculation,
    isLoading,
    error,
    totalCompanyAuditCirculations,
    ...crudActions,
    byFinancialPeriod,
    byAuditCycle,
  }
})
