import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyNotifyChangeOfName } from "~/scripts/models/CompanyNotifyChangeOfName"

export const useCompanyNotifyChangeOfNameStore = defineStore("companyNotifyChangeOfName", () => {
  const { $repositories } = useNuxtApp()

  const companyNotifyChangeOfNames = ref<CompanyNotifyChangeOfName[]>([])
  const companyNotifyChangeOfName = ref<CompanyNotifyChangeOfName | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyNotifyChangeOfNames, {
    items: companyNotifyChangeOfNames,
    item: companyNotifyChangeOfName,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyNotifyChangeOfNames = computed(() => companyNotifyChangeOfNames.value.length)

  return {
    companyNotifyChangeOfNames,
    companyNotifyChangeOfName,
    isLoading,
    error,
    totalCompanyNotifyChangeOfNames,
    ...crudActions
  }
})
