import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyBankAccountClosure } from "~/scripts/models/CompanyBankAccountClosure"

export const useCompanyBankAccountClosureStore = defineStore("companyBankAccountClosure", () => {
  const { $repositories } = useNuxtApp()

  const companyBankAccountClosures = ref<CompanyBankAccountClosure[]>([])
  const companyBankAccountClosure = ref<CompanyBankAccountClosure | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyBankAccountClosures, {
    items: companyBankAccountClosures,
    item: companyBankAccountClosure,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyBankAccountClosures = computed(() => companyBankAccountClosures.value.length)

  return {
    companyBankAccountClosures,
    companyBankAccountClosure,
    isLoading,
    error,
    totalCompanyBankAccountClosures,
    ...crudActions
  }
})
