import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyCommonSealReplacement } from "~/scripts/models/CompanyCommonSealReplacement"

export const useCompanyCommonSealReplacementStore = defineStore("companyCommonSealReplacement", () => {
  const { $repositories } = useNuxtApp()

  const companyCommonSealReplacements = ref<CompanyCommonSealReplacement[]>([])
  const companyCommonSealReplacement = ref<CompanyCommonSealReplacement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyCommonSealReplacements, {
    items: companyCommonSealReplacements,
    item: companyCommonSealReplacement,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyCommonSealReplacements = computed(() => companyCommonSealReplacements.value.length)

  return {
    companyCommonSealReplacements,
    companyCommonSealReplacement,
    isLoading,
    error,
    totalCompanyCommonSealReplacements,
    ...crudActions
  }
})
