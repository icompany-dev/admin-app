import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { ProgressItem } from '~/scripts/models/ProgressItem'

export const useProgressStore = defineStore('progress', () => {
  const { $repositories } = useNuxtApp()
  const progressItems = ref<ProgressItem[]>([])
  const progressItem = ref<ProgressItem|null>(null)
  const isLoading = ref(false)
  const error = ref<string|null>(null)

  async function fetchList() {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.progresses.fetchList()
      progressItems.value  = response.data

      isLoading.value = false
    } catch (e: any) {
      error.value = e.message || 'Unable to fetch list of application progresses'
      console.error('Fail to fetch list of application progress', e)
    }
  }

  const totalProgressItems = computed(() => progressItems.value.length)

  return {
    progressItems,
    progressItem,
    isLoading,
    error,
    totalProgressItems,
    fetchList
  }
})