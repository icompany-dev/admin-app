import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"

export const useCompanyShareholderAllotmentStore = defineStore("companyShareholderAllotment", () => {
  const { $repositories } = useNuxtApp()

  const companyShareholderAllotments = ref<CompanyShareholderAllotment[]>([])
  const companyShareholderAllotment = ref<CompanyShareholderAllotment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyShareholderAllotments, {
    items: companyShareholderAllotments,
    item: companyShareholderAllotment,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyShareholderAllotments = computed(() => companyShareholderAllotments.value.length)

  return {
    companyShareholderAllotments,
    companyShareholderAllotment,
    isLoading,
    error,
    totalCompanyShareholderAllotments,
    ...crudActions,
  }
})
