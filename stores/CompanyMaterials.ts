import { defineStore } from "pinia"
import type { CompanyMaterial } from "~/scripts/models/CompanyMaterial"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyMaterialStore = defineStore("companyMaterial", () => {
  const { $repositories } = useNuxtApp()

  const companyMaterials = ref<CompanyMaterial[]>([])
  const companyMaterial = ref<CompanyMaterial | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyMaterials, {
    items: companyMaterials,
    item: companyMaterial,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyMaterials = computed(() => companyMaterials.value.length)

  return {
    companyMaterials,
    companyMaterial,
    isLoading,
    error,
    totalCompanyMaterials,
    ...crudActions,
  }
})
