import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

export const useCompanyBankAccountOpeningStore = defineStore("companyBankAccountOpening", () => {
  const { $repositories } = useNuxtApp()

  const companyBankAccountOpenings = ref<CompanyBankAccountOpening[]>([])
  const companyBankAccountOpening = ref<CompanyBankAccountOpening | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyBankAccountOpenings, {
    items: companyBankAccountOpenings,
    item: companyBankAccountOpening,
    isLoading: isLoading,
    error: error,
  })

  async function addBankAccountNumber(id: string, accountNumber: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyBankAccountOpenings.addBankAccountNumber(id, accountNumber)
      return response.data ?? null
    } catch (e: any) {
      error.value = e.message || "Failed to update bank account number"
      console.error("Error updating bank account number", e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyBankAccountOpenings = computed(() => companyBankAccountOpenings.value.length)

  return {
    companyBankAccountOpenings,
    companyBankAccountOpening,
    isLoading,
    error,
    totalCompanyBankAccountOpenings,
    ...crudActions,
    addBankAccountNumber,
  }
})
