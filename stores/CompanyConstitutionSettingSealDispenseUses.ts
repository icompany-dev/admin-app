import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingSealDispenseUse } from "~/scripts/models/CompanyConstitutionSettingSealDispenseUse"

export const useCompanyConstitutionSettingSealDispenseUseStore = defineStore("companyConstitutionSettingSealDispenseUse", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingSealDispenseUses = ref<CompanyConstitutionSettingSealDispenseUse[]>([])
  const companyConstitutionSettingSealDispenseUse = ref<CompanyConstitutionSettingSealDispenseUse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingSealDispenseUses, {
    items: companyConstitutionSettingSealDispenseUses,
    item: companyConstitutionSettingSealDispenseUse,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingSealDispenseUses = computed(() => companyConstitutionSettingSealDispenseUses.value.length)

  return {
    companyConstitutionSettingSealDispenseUses,
    companyConstitutionSettingSealDispenseUse,
    isLoading,
    error,
    totalCompanyConstitutionSettingSealDispenseUses,
    ...crudActions
  }
})
