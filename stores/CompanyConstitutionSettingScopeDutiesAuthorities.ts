import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingScopeDutiesAuthority } from "~/scripts/models/CompanyConstitutionSettingScopeDutiesAuthority"

export const useCompanyConstitutionSettingScopeDutiesAuthorityStore = defineStore("companyConstitutionSettingScopeDutiesAuthority", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingScopeDutiesAuthorities = ref<CompanyConstitutionSettingScopeDutiesAuthority[]>([])
  const companyConstitutionSettingScopeDutiesAuthority = ref<CompanyConstitutionSettingScopeDutiesAuthority | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingScopeDutiesAuthorities, {
    items: companyConstitutionSettingScopeDutiesAuthorities,
    item: companyConstitutionSettingScopeDutiesAuthority,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingScopeDutiesAuthorities = computed(() => companyConstitutionSettingScopeDutiesAuthorities.value.length)

  return {
    companyConstitutionSettingScopeDutiesAuthorities,
    companyConstitutionSettingScopeDutiesAuthority,
    isLoading,
    error,
    totalCompanyConstitutionSettingScopeDutiesAuthorities,
    ...crudActions
  }
})
