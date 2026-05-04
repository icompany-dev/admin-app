import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import { useStoreActions } from '~/stores/StoreActions'
import { SignatureGroup } from '~/scripts/models/SignatureGroup'

export const useSignatureStore = defineStore('signature', () => {
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

  const totalSignatures = computed(() => signatures.value.length)

  return {
    signatures,
    signature,
    isLoading,
    error,
    totalSignatures,
    ...crudActions,
  }
})
