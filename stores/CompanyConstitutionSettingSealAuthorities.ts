import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingSealAuthority } from "~/scripts/models/CompanyConstitutionSettingSealAuthority"

export const useCompanyConstitutionSettingSealAuthorityStore = defineStore("companyConstitutionSettingSealAuthority", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingSealAuthorities = ref<CompanyConstitutionSettingSealAuthority[]>([])
  const companyConstitutionSettingSealAuthority = ref<CompanyConstitutionSettingSealAuthority | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingSealAuthorities, {
    items: companyConstitutionSettingSealAuthorities,
    item: companyConstitutionSettingSealAuthority,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingSealAuthorities = computed(() => companyConstitutionSettingSealAuthorities.value.length)

  return {
    companyConstitutionSettingSealAuthorities,
    companyConstitutionSettingSealAuthority,
    isLoading,
    error,
    totalCompanyConstitutionSettingSealAuthorities,
    ...crudActions
  }
})
