import { defineStore } from 'pinia'
import { MyDataNameSearch } from '~/scripts/models/MyDataNameSearch'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'

export const useMyDataNameSearchStore = defineStore('myDataNameSearch', () => {
  const { $repositories } = useNuxtApp()

  const myDataNameSearchs = ref<MyDataNameSearch[]>([])
  const myDataNameSearch = ref<MyDataNameSearch | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.myDataNameSearch, {
    items: myDataNameSearchs,
    item: myDataNameSearch,
    isLoading: isLoading,
    error: error,
  })

  async function nameSearch(name: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any =
        await $repositories.myDataNameSearch.nameSearch(name)
      myDataNameSearch.value = response.data ?? null
    } catch (e: any) {
      error.value = e.message || `Failed to fetch myDataNameSearchs for company`
      console.error(`Error to fetch myDataNameSearchs by company id`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalMyDataNameSearchs = computed(() => myDataNameSearchs.value.length)

  return {
    myDataNameSearchs,
    myDataNameSearch,
    isLoading,
    error,
    totalMyDataNameSearchs,
    ...crudActions,
    nameSearch
  }
})
