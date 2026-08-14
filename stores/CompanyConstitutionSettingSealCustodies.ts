import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingSealCustody } from "~/scripts/models/CompanyConstitutionSettingSealCustody"

export const useCompanyConstitutionSettingSealCustodyStore = defineStore("companyConstitutionSettingSealCustody", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingSealCustodies = ref<CompanyConstitutionSettingSealCustody[]>([])
  const companyConstitutionSettingSealCustody = ref<CompanyConstitutionSettingSealCustody | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingSealCustodies, {
    items: companyConstitutionSettingSealCustodies,
    item: companyConstitutionSettingSealCustody,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingSealCustodies = computed(() => companyConstitutionSettingSealCustodies.value.length)

  return {
    companyConstitutionSettingSealCustodies,
    companyConstitutionSettingSealCustody,
    isLoading,
    error,
    totalCompanyConstitutionSettingSealCustodies,
    ...crudActions
  }
})
