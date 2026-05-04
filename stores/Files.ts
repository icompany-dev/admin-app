import { defineStore } from "pinia"
import { File, FileBase64Response } from "~/scripts/models/File"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useFileStore = defineStore("file", () => {
  const { $repositories } = useNuxtApp()

  const files = ref<File[]>([])
  const file = ref<File | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.files, {
    items: files,
    item: file,
    isLoading: isLoading,
    error: error,
  })

  async function uploadFile(formData: FormData): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.files.uploadFile(formData, () => {})
      file.value = response.data ? new File(response.data) : null
      return file.value
    } catch (e: any) {
      error.value = e.message || `Failed to upload file`
      console.error(`Error to upload document`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function convertImgToBase64(url: string): Promise<FileBase64Response | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.files.convertImgUrlToBase64(url)
      return new FileBase64Response(response)
    } catch (e: any) {
      error.value = e.message || `Failed to upload file`
      console.error(`Error to upload document`, e)

      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalFiles = computed(() => files.value.length)

  return {
    files,
    file,
    isLoading,
    error,
    totalFiles,
    ...crudActions,
    uploadFile,
    convertImgToBase64,
  }
})
