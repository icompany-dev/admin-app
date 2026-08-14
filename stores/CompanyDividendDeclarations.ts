export enum DividendDeclarationType {
  Immediate = "immediate",
  FourteenDays = "fourteen-days",
}
import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"

export const useCompanyDividendDeclarationStore = defineStore("companyDividendDeclaration", () => {
  const { $repositories } = useNuxtApp()

  const companyDividendDeclarations = ref<CompanyDividendDeclaration[]>([])
  const companyDividendDeclaration = ref<CompanyDividendDeclaration | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDividendDeclarations, {
    items: companyDividendDeclarations,
    item: companyDividendDeclaration,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDividendDeclarations = computed(() => companyDividendDeclarations.value.length)

  return {
    companyDividendDeclarations,
    companyDividendDeclaration,
    isLoading,
    error,
    totalCompanyDividendDeclarations,
    ...crudActions,
  }
})
