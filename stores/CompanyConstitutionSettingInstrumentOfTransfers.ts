import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingInstrumentOfTransfer } from "~/scripts/models/CompanyConstitutionSettingInstrumentOfTransfer"

export const useCompanyConstitutionSettingInstrumentOfTransferStore = defineStore("companyConstitutionSettingInstrumentOfTransfer", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingInstrumentOfTransfers = ref<CompanyConstitutionSettingInstrumentOfTransfer[]>([])
  const companyConstitutionSettingInstrumentOfTransfer = ref<CompanyConstitutionSettingInstrumentOfTransfer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingInstrumentOfTransfers, {
    items: companyConstitutionSettingInstrumentOfTransfers,
    item: companyConstitutionSettingInstrumentOfTransfer,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingInstrumentOfTransfers = computed(() => companyConstitutionSettingInstrumentOfTransfers.value.length)

  return {
    companyConstitutionSettingInstrumentOfTransfers,
    companyConstitutionSettingInstrumentOfTransfer,
    isLoading,
    error,
    totalCompanyConstitutionSettingInstrumentOfTransfers,
    ...crudActions
  }
})
