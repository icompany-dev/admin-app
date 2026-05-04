import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'
import { CompanyAmendmentName } from '~/scripts/models/CompanyAmendmentName'

export const useCompanyAmendmentNameStore = defineStore('companyAmendmentName', () => {
  const { $repositories } = useNuxtApp()

  const companyAmendmentNames = ref<CompanyAmendmentName[]>([])
  const companyAmendmentName = ref<CompanyAmendmentName | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAmendmentNames, {
    items: companyAmendmentNames,
    item: companyAmendmentName,
    isLoading: isLoading,
    error: error,
  })

  async function hasOngoing(companyId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyAmendmentNames.hasOngoing(companyId)
      return response.has_ongoing ? response.has_ongoing === 1 : false
    } catch (e:any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentNames = computed(() => companyAmendmentNames.value.length)

  return {
    companyAmendmentNames,
    companyAmendmentName,
    isLoading,
    error,
    totalCompanyAmendmentNames,
    ...crudActions,
    hasOngoing
  }
})