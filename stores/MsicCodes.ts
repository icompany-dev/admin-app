import { defineStore } from "pinia"
import { MsicCode } from "~/scripts/models/MsicCode"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useMsicCodeStore = defineStore("msicCode", () => {
  const { $repositories } = useNuxtApp()

  const msicCodes = ref<MsicCode[]>([])
  const msicCode = ref<MsicCode | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.msicCodes, {
    items: msicCodes,
    item: msicCode,
    isLoading: isLoading,
    error: error,
  })

  async function searchByKeyword(keyword: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.msicCodes.searchByKeyword(keyword)
      return response
    } catch (e) {
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalMsicCodes = computed(() => msicCodes.value.length)

  return {
    msicCodes,
    msicCode,
    isLoading,
    error,
    totalMsicCodes,
    ...crudActions,
    searchByKeyword,
  }
})
