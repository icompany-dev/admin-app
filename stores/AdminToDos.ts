import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { AdminToDo } from "~/scripts/models/AdminToDo"

export const useAdminToDoStore = defineStore("adminToDo", () => {
  const { $repositories } = useNuxtApp()

  const adminToDos = ref<AdminToDo[]>([])
  const adminToDo = ref<AdminToDo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.adminToDos, {
    items: adminToDos,
    item: adminToDo,
    isLoading: isLoading,
    error: error,
  })

  const totalAdminToDos = computed(() => adminToDos.value.length)

  return {
    adminToDos,
    adminToDo,
    isLoading,
    error,
    totalAdminToDos,
    ...crudActions
  }
})
