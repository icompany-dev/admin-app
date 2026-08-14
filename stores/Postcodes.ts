import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import type { Filter } from "~/scripts/library/Filter"
import { PostcodeMapping } from "~/scripts/models/Location"

export const usePostcodeStore = defineStore("postcode", () => {
  const { $repositories } = useNuxtApp()
  const postcodes = ref<PostcodeMapping[]>([])
  const postcode = ref<PostcodeMapping | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function search(filter: Filter): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.postcodes.search(filter)
      postcodes.value = []
      if (response.data && Array.isArray(response.data)) {
        postcodes.value = response.data.map((data: any) => {
          return new PostcodeMapping(data)
        })
      }
    } catch (e: any) {
      error.value = e.message || "Failed to fetch postcodes for user"
      console.error(`Fail to fetch postcodes for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function byCityId(cityId: number): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.postcodes.byCityId(cityId)
      postcodes.value = response.data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch postcodes for user"
      console.error(`Fail to fetch postcodes for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  const totalPostcodes = computed(() => postcodes.value.length)

  return {
    postcodes,
    postcode,
    isLoading,
    error,
    totalPostcodes,
    search,
    byCityId,
  }
})
