import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyCommonSealRegister } from "~/scripts/models/CompanyCommonSealRegister"

export const useCompanyCommonSealRegisterStore = defineStore("companyCommonSealRegister", () => {
  const { $repositories } = useNuxtApp()

  const companyCommonSealRegisters = ref<CompanyCommonSealRegister[]>([])
  const companyCommonSealRegister = ref<CompanyCommonSealRegister | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyCommonSealRegisters, {
    items: companyCommonSealRegisters,
    item: companyCommonSealRegister,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyCommonSealRegisters = computed(() => companyCommonSealRegisters.value.length)

  return {
    companyCommonSealRegisters,
    companyCommonSealRegister,
    isLoading,
    error,
    totalCompanyCommonSealRegisters,
    ...crudActions
  }
})
