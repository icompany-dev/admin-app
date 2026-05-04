import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingSealSign } from "~/scripts/models/CompanyConstitutionSettingSealSign"

export const useCompanyConstitutionSettingSealSignStore = defineStore("companyConstitutionSettingSealSign", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingSealSigns = ref<CompanyConstitutionSettingSealSign[]>([])
  const companyConstitutionSettingSealSign = ref<CompanyConstitutionSettingSealSign | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingSealSigns, {
    items: companyConstitutionSettingSealSigns,
    item: companyConstitutionSettingSealSign,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingSealSigns = computed(() => companyConstitutionSettingSealSigns.value.length)

  return {
    companyConstitutionSettingSealSigns,
    companyConstitutionSettingSealSign,
    isLoading,
    error,
    totalCompanyConstitutionSettingSealSigns,
    ...crudActions
  }
})
