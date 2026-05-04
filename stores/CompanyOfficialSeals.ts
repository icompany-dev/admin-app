import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyOfficialSeal } from "~/scripts/models/CompanyOfficialSeal"

export const useCompanyOfficialSealStore = defineStore("companyOfficialSeal", () => {
  const { $repositories } = useNuxtApp()

  const companyOfficialSeals = ref<CompanyOfficialSeal[]>([])
  const companyOfficialSeal = ref<CompanyOfficialSeal | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyOfficialSeals, {
    items: companyOfficialSeals,
    item: companyOfficialSeal,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyOfficialSeals = computed(() => companyOfficialSeals.value.length)

  return {
    companyOfficialSeals,
    companyOfficialSeal,
    isLoading,
    error,
    totalCompanyOfficialSeals,
    ...crudActions
  }
})
