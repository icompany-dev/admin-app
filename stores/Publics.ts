import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { Model } from "~/scripts/models/Model"

export const usePublicStore = defineStore("public", () => {
  const { $repositories } = useNuxtApp()
  const publics = ref<Model | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function validateExternal(target: string, targetId: string, code: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.publics.validateExternal(target, targetId, code)
      return response.access_hash ?? null
    } catch (e: any) {
      error.value = e.message || "failed to validate external user"
      console.error(`Failed to validate external user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function uploadFile(
    accessHash: string,
    target: string,
    targetId: string,
    file: string,
    fileDescription: string
  ): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.publics.uploadFile(accessHash, target, targetId, file, fileDescription)
      return response.data ?? null
    } catch (e: any) {
      error.value = e.message || "Failed to upload file"
      console.error(`Fail to upload file`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    publics,
    isLoading,
    error,
    validateExternal,
    uploadFile,
  }
})
