import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDelegationOfAuthority } from "~/scripts/models/CompanyDelegationOfAuthority"

export const useCompanyDelegationOfAuthorityStore = defineStore("companyDelegationOfAuthority", () => {
  const { $repositories } = useNuxtApp()

  const companyDelegationOfAuthorities = ref<CompanyDelegationOfAuthority[]>([])
  const companyDelegationOfAuthority = ref<CompanyDelegationOfAuthority | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDelegationOfAuthorities, {
    items: companyDelegationOfAuthorities,
    item: companyDelegationOfAuthority,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDelegationOfAuthorities = computed(() => companyDelegationOfAuthorities.value.length)

  return {
    companyDelegationOfAuthorities,
    companyDelegationOfAuthority,
    isLoading,
    error,
    totalCompanyDelegationOfAuthorities,
    ...crudActions,
  }
})
