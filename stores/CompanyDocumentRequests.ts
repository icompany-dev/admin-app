import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDocumentRequest } from "~/scripts/models/CompanyDocumentRequest"

export const useCompanyDocumentRequestStore = defineStore("companyDocumentRequest", () => {
  const { $repositories } = useNuxtApp()

  const companyDocumentRequests = ref<CompanyDocumentRequest[]>([])
  const companyDocumentRequest = ref<CompanyDocumentRequest | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDocumentRequests, {
    items: companyDocumentRequests,
    item: companyDocumentRequest,
    isLoading: isLoading,
    error: error,
  })

  async function purchaseDocuments(requestId: string): Promise<CompanyDocumentRequest | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyDocumentRequests.purchaseDocuments(requestId)
      return new CompanyDocumentRequest(response.data)
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function purchaseCorporateProfile(requestId: string): Promise<CompanyDocumentRequest | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyDocumentRequests.purchaseCorporateProfile(requestId)
      return new CompanyDocumentRequest(response.data)
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // NOTE: this function will receive the PDF content. The caller of this function MUST put it in a blob to save
  async function download(itemId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyDocumentRequests.download(itemId)
      return response
    } catch (e: any) {
      console.error(`Error to check has ongoing amendment names`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLatestPaidForDocument(
    companyId: string,
    documentName: string
  ): Promise<CompanyDocumentRequest | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyDocumentRequests.fetchLatestPaidForDocument(
        companyId,
        documentName
      )
      if (response.data === null) {
        return null
      }

      return new CompanyDocumentRequest(response.data)
    } catch (e: any) {
      console.error("Failed to fetch latest paid for document", e)
      error.value = `Failed to fetch latest paid for document`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function email(name: string, email: string, documentName: string, fileUrl: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.companyDocumentRequests.email(name, email, documentName, fileUrl)
      return response
    } catch (e: any) {
      console.error(`Error to email document`, e)
      error.value = `Failed to email document`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyDocumentRequests = computed(() => companyDocumentRequests.value.length)

  return {
    companyDocumentRequests,
    companyDocumentRequest,
    isLoading,
    error,
    totalCompanyDocumentRequests,
    ...crudActions,
    purchaseDocuments,
    purchaseCorporateProfile,
    download,
    fetchLatestPaidForDocument,
    email,
  }
})
