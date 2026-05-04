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

  const totalCompanyBankAccountOpenings = computed(() => companyBankAccountOpenings.value.length)

  return {
    companyBankAccountOpenings,
    companyBankAccountOpening,
    isLoading,
    error,
    totalCompanyBankAccountOpenings,
    ...crudActions,
  }
})
