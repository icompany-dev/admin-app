import { defineStore } from 'pinia'
import type { CompanyNameRegister } from '~/scripts/models/CompanyNameRegister'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'

export const useCompanyNameRegisterStore = defineStore('companyNameRegister', () => {
  const { $repositories } = useNuxtApp()

  const companyNameRegisters = ref<CompanyNameRegister[]>([])
  const companyNameRegister = ref<CompanyNameRegister | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyNameRegisters, {
    items: companyNameRegisters,
    item: companyNameRegister,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllOld(slug: string | null): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any =
        await $repositories.companyNameRegisters.fetchAllOld(slug)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch companyNameRegisters for company`
      console.error(`Error to fetch companyNameRegisters by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyNameRegisters = computed(() => companyNameRegisters.value.length)

  return {
    companyNameRegisters,
    companyNameRegister,
    isLoading,
    error,
    totalCompanyNameRegisters,
    ...crudActions,
    fetchAllOld
  }
})
