import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyContractEnter } from "~/scripts/models/CompanyContractEnter"

export const useCompanyContractEnterStore = defineStore("companyContractEnter", () => {
  const { $repositories } = useNuxtApp()

  const companyContractEnters = ref<CompanyContractEnter[]>([])
  const companyContractEnter = ref<CompanyContractEnter | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyContractEnters, {
    items: companyContractEnters,
    item: companyContractEnter,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyContractEnters = computed(() => companyContractEnters.value.length)

  return {
    companyContractEnters,
    companyContractEnter,
    isLoading,
    error,
    totalCompanyContractEnters,
    ...crudActions
  }
})
