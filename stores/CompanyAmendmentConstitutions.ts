import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"

export const useCompanyAmendmentConstitutionStore = defineStore("companyAmendmentConstitution", () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentConstitutiones = ref<CompanyAmendmentConstitution[]>([])
  const companyAmendmentConstitution = ref<CompanyAmendmentConstitution | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentConstitutions, {
    items: companyAmendmentConstitutiones,
    item: companyAmendmentConstitution,
    isLoading: isLoading,
    error: error,
  })
  const totalCompanyAmendmentConstitutiones = computed(() => companyAmendmentConstitutiones.value.length)

  return {
    companyAmendmentConstitutiones,
    companyAmendmentConstitution,
    isLoading,
    error,
    totalCompanyAmendmentConstitutiones,
    ...crudActions,
  }
})
