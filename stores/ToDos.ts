import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'
import { ToDo } from '~/scripts/models/ToDo'

export const useToDoStore = defineStore('toDo', () => {
  const { $repositories } = useNuxtApp()
  const toDos = ref<ToDo[]>([])
  const toDo = ref<ToDo|null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.toDos, {
    items: toDos,
    item: toDo,
    isLoading: isLoading,
    error: error
  })

  async function fetchList() {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.toDos.fetchList()
      toDos.value = response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch to-do list for user'
      console.error(`Fail to fetch to-do list for user`, e)
    }
  }

  const totalToDos = computed(() => toDos.value.length)

  return {
    toDos,
    toDo,
    isLoading,
    error,
    totalToDos,
    ...crudActions,
    fetchList
  }
})