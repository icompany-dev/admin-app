import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingRegisterTransfer } from "~/scripts/models/CompanyConstitutionSettingRegisterTransfer"

export const useCompanyConstitutionSettingRegisterTransferStore = defineStore("companyConstitutionSettingRegisterTransfer", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingRegisterTransfers = ref<CompanyConstitutionSettingRegisterTransfer[]>([])
  const companyConstitutionSettingRegisterTransfer = ref<CompanyConstitutionSettingRegisterTransfer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingRegisterTransfers, {
    items: companyConstitutionSettingRegisterTransfers,
    item: companyConstitutionSettingRegisterTransfer,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingRegisterTransfers = computed(() => companyConstitutionSettingRegisterTransfers.value.length)

  return {
    companyConstitutionSettingRegisterTransfers,
    companyConstitutionSettingRegisterTransfer,
    isLoading,
    error,
    totalCompanyConstitutionSettingRegisterTransfers,
    ...crudActions
  }
})
