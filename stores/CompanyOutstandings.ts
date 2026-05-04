import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyOutstanding } from "~/scripts/models/CompanyOutstanding"

export const useCompanyOutstandingStore = defineStore("companyOutstanding", () => {
  const { $repositories } = useNuxtApp()

  const companyOutstandings = ref<CompanyOutstanding[]>([])
  const companyOutstanding = ref<CompanyOutstanding | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyOutstandings, {
    items: companyOutstandings,
    item: companyOutstanding,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyOutstandings = computed(() => companyOutstandings.value.length)

  return {
    companyOutstandings,
    companyOutstanding,
    isLoading,
    error,
    totalCompanyOutstandings,
    ...crudActions
  }
})
