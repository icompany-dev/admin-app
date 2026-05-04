import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanySection47 } from "~/scripts/models/CompanySection47"

export const useCompanySection47Store = defineStore("companySection47", () => {
  const { $repositories } = useNuxtApp()

  const companySection47s = ref<CompanySection47[]>([])
  const companySection47 = ref<CompanySection47 | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companySection47s, {
    items: companySection47s,
    item: companySection47,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanySection47s = computed(() => companySection47s.value.length)

  return {
    companySection47s,
    companySection47,
    isLoading,
    error,
    totalCompanySection47s,
    ...crudActions,
  }
})
