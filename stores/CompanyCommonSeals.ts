import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyCommonSeal } from "~/scripts/models/CompanyCommonSeal"

export const useCompanyCommonSealStore = defineStore("companyCommonSeal", () => {
  const { $repositories } = useNuxtApp()

  const companyCommonSeals = ref<CompanyCommonSeal[]>([])
  const companyCommonSeal = ref<CompanyCommonSeal | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyCommonSeals, {
    items: companyCommonSeals,
    item: companyCommonSeal,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyCommonSeals = computed(() => companyCommonSeals.value.length)

  return {
    companyCommonSeals,
    companyCommonSeal,
    isLoading,
    error,
    totalCompanyCommonSeals,
    ...crudActions
  }
})
