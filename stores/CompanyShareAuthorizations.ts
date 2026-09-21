import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyShareAuthorization } from "~/scripts/models/CompanyShareAuthorization"

export const useCompanyShareAuthorizationStore = defineStore("companyShareAuthorization", () => {
  const { $repositories } = useNuxtApp()

  const companyShareAuthorizations = ref<CompanyShareAuthorization[]>([])
  const companyShareAuthorization = ref<CompanyShareAuthorization | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyShareAuthorizations, {
    items: companyShareAuthorizations,
    item: companyShareAuthorization,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyShareAuthorizations = computed(() => companyShareAuthorizations.value.length)

  return {
    companyShareAuthorizations,
    companyShareAuthorization,
    isLoading,
    error,
    totalCompanyShareAuthorizations,
    ...crudActions
  }
})
