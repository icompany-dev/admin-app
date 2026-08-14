import { defineStore } from 'pinia'
import type { CompanyNameFilter } from '~/scripts/models/CompanyNameFilter'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'

export const useCompanyNameFilterStore = defineStore('companyNameFilter', () => {
  const { $repositories } = useNuxtApp()

  const companyNameFilters = ref<CompanyNameFilter[]>([])
  const companyNameFilter = ref<CompanyNameFilter | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyNameFilters, {
    items: companyNameFilters,
    item: companyNameFilter,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllOld(slug: string | null): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any =
        await $repositories.companyNameFilters.fetchAllOld(slug)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch companyNameFilters for company`
      console.error(`Error to fetch companyNameFilters by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyNameFilters = computed(() => companyNameFilters.value.length)

  return {
    companyNameFilters,
    companyNameFilter,
    isLoading,
    error,
    totalCompanyNameFilters,
    ...crudActions,
    fetchAllOld
  }
})
