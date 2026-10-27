import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"

export const useCompanyFinancialStatementAuthorisedPersonStore = defineStore(
  "companyFinancialStatementAuthorisedPerson",
  () => {
    const { $repositories } = useNuxtApp()

    const companyFinancialStatementAuthorisedPersons = ref<CompanyFinancialStatementAuthorisedPerson[]>([])
    const companyFinancialStatementAuthorisedPerson = ref<CompanyFinancialStatementAuthorisedPerson | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyFinancialStatementAuthorisedPersons, {
      items: companyFinancialStatementAuthorisedPersons,
      item: companyFinancialStatementAuthorisedPerson,
      isLoading: isLoading,
      error: error,
    })

    async function byFinancialPeriod(
      financialPeriodId: string
    ): Promise<CompanyFinancialStatementAuthorisedPerson | null> {
      isLoading.value = true
      error.value = null

      try {
        const response: any =
          await $repositories.companyFinancialStatementAuthorisedPersons.byFinancialPeriod(financialPeriodId)
        return new CompanyFinancialStatementAuthorisedPerson(response.data)
      } catch (e: any) {
        console.error(`Error to get by financial period id`, e)
        return null
      } finally {
        isLoading.value = false
      }
    }

    const totalCompanyFinancialStatementAuthorisedPersons = computed(
      () => companyFinancialStatementAuthorisedPersons.value.length
    )

    return {
      companyFinancialStatementAuthorisedPersons,
      companyFinancialStatementAuthorisedPerson,
      isLoading,
      error,
      totalCompanyFinancialStatementAuthorisedPersons,
      ...crudActions,
      byFinancialPeriod,
    }
  }
)
