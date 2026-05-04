import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAuditor } from "~/scripts/models/CompanyAuditor"

export const useCompanyAuditorStore = defineStore("companyAuditor", () => {
  const { $repositories } = useNuxtApp()

  const companyAuditors = ref<CompanyAuditor[]>([])
  const companyAuditor = ref<CompanyAuditor | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAuditors, {
    items: companyAuditors,
    item: companyAuditor,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAuditors = computed(() => companyAuditors.value.length)

  return {
    companyAuditors,
    companyAuditor,
    isLoading,
    error,
    totalCompanyAuditors,
    ...crudActions
  }
})
