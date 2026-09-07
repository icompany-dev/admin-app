import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"

export const useSignatureStore = defineStore("signature", () => {
  const { $repositories } = useNuxtApp()

  const signatures = ref<SignatureGroup[]>([])
  const signature = ref<SignatureGroup | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.signatures, {
    items: signatures,
    item: signature,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByGroup(companyId: string, group: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.signatures.fetchByGroup(companyId, group)
      return response.data ?? []
    } catch (e: any) {
      error.value = e.message || `Failed to fetch shareholders for company`
      console.error(`Error to fetch shareholders by company id`, e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalSignatures = computed(() => signatures.value.length)

  return {
    signatures,
    signature,
    isLoading,
    error,
    totalSignatures,
    ...crudActions,
    fetchByGroup,
  }
})
