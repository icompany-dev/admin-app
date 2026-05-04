export enum DirectorResignationType {
  Immediate = "immediate",
  FourteenDays = "fourteen-days",
}
import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"

export const useCompanyDirectorResignationStore = defineStore("companyDirectorResignation", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorResignations = ref<CompanyDirectorResignation[]>([])
  const companyDirectorResignation = ref<CompanyDirectorResignation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorResignations, {
    items: companyDirectorResignations,
    item: companyDirectorResignation,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDirectorResignations = computed(() => companyDirectorResignations.value.length)

  return {
    companyDirectorResignations,
    companyDirectorResignation,
    isLoading,
    error,
    totalCompanyDirectorResignations,
    ...crudActions,
  }
})
