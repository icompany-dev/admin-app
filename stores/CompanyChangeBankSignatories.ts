import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"

export const useCompanyChangeBankSignatoryStore = defineStore("companyChangeBankSignatory", () => {
  const { $repositories } = useNuxtApp()

  const companyChangeBankSignatories = ref<CompanyChangeBankSignatory[]>([])
  const companyChangeBankSignatory = ref<CompanyChangeBankSignatory | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyChangeBankSignatories, {
    items: companyChangeBankSignatories,
    item: companyChangeBankSignatory,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyChangeBankSignatories = computed(() => companyChangeBankSignatories.value.length)

  return {
    companyChangeBankSignatories,
    companyChangeBankSignatory,
    isLoading,
    error,
    totalCompanyChangeBankSignatories,
    ...crudActions
  }
})
