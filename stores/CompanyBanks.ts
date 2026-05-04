import { defineStore } from "pinia"
import type { CompanyBank } from "~/scripts/models/CompanyBank"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyBankStore = defineStore("companyBank", () => {
  const { $repositories } = useNuxtApp()

  const companyBanks = ref<CompanyBank[]>([])
  const companyBank = ref<CompanyBank | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyBanks, {
    items: companyBanks,
    item: companyBank,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyBanks = computed(() => companyBanks.value.length)

  return {
    companyBanks,
    companyBank,
    isLoading,
    error,
    totalCompanyBanks,
    ...crudActions,
  }
})
