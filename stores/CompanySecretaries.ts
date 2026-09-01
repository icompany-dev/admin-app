import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanySecretary } from "~/scripts/models/CompanySecretary"

export const useCompanySecretaryStore = defineStore("companySecretary", () => {
  const { $repositories } = useNuxtApp()

  const companySecretaries = ref<CompanySecretary[]>([])
  const companySecretary = ref<CompanySecretary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companySecretaries, {
    items: companySecretaries,
    item: companySecretary,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanySecretaries = computed(() => companySecretaries.value.length)

  return {
    companySecretaries,
    companySecretary,
    isLoading,
    error,
    totalCompanySecretaries,
    ...crudActions
  }
})
