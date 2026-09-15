import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyFundSourceDeclaration } from "~/scripts/models/CompanyFundSourceDeclaration"

export const useCompanyFundSourceDeclarationStore = defineStore("companyFundSourceDeclaration", () => {
  const { $repositories } = useNuxtApp()

  const companyFundSourceDeclarations = ref<CompanyFundSourceDeclaration[]>([])
  const companyFundSourceDeclaration = ref<CompanyFundSourceDeclaration | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyFundSourceDeclarations, {
    items: companyFundSourceDeclarations,
    item: companyFundSourceDeclaration,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyFundSourceDeclarations = computed(() => companyFundSourceDeclarations.value.length)

  return {
    companyFundSourceDeclarations,
    companyFundSourceDeclaration,
    isLoading,
    error,
    totalCompanyFundSourceDeclarations,
    ...crudActions
  }
})
