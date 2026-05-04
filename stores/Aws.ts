import { useNuxtApp } from "#app"
import { defineStore } from "pinia"

export const useAwsStore = defineStore("aws", () => {
  const { $externalApis } = useNuxtApp()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getReceipt(filename: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $externalApis.aws.getReceiptFile(filename)
      return response
    } catch (e: any) {
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getReceipt,
  }
})
