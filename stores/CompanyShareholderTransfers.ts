import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { Section105Data } from "~/scripts/types/share-transfers/Section105Data"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"

export const useCompanyShareholderTransferStore = defineStore("companyShareholderTransfer", () => {
  const { $repositories } = useNuxtApp()

  const companyShareholderTransfers = ref<CompanyShareholderTransfer[]>([])
  const companyShareholderTransfer = ref<CompanyShareholderTransfer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyShareholderTransfers, {
    items: companyShareholderTransfers,
    item: companyShareholderTransfer,
    isLoading: isLoading,
    error: error,
  })

  async function lodge(id: string): Promise<CompanyShareholderTransfer | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.lodge(id)
      return response.data ? new CompanyShareholderTransfer(response.data) : null
    } catch (e: any) {
      console.error(`Failed to lodge transfer id ${id}`, e)
      error.value = `Failed to lodge transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function paymentReceived(id: string): Promise<CompanyShareholderTransfer | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.paymentReceived(id)
      return response.data ? new CompanyShareholderTransfer(response.data) : null
    } catch (e: any) {
      console.error(`Failed to record payment received for transfer id ${id}`, e)
      error.value = `Failed to record payment received for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function paymentMade(id: string): Promise<CompanyShareholderTransfer | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.paymentMade(id)
      return response.data ? new CompanyShareholderTransfer(response.data) : null
    } catch (e: any) {
      console.error(`Failed to record payment made for transfer id ${id}`, e)
      error.value = `Failed to record payment made for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSection105Data(id: string): Promise<Section105Data | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.fetchSection105Data(id)
      return response ? new Section105Data(response) : null
    } catch (e: any) {
      console.error(`Failed to fetch data for Section 105 for transfer id ${id}`, e)
      error.value = `Failed to fetch data for Section 105 for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSection105DataForPublic(id: string, accessHash: string): Promise<Section105Data | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.fetchSection105DataForPublic(id, accessHash)
      return response ? new Section105Data(response) : null
    } catch (e: any) {
      console.error(`Failed to fetch data for Section 105 for transfer id ${id}`, e)
      error.value = `Failed to fetch data for Section 105 for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSection105Pending(): Promise<CompanyShareholderTransfer[]> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.fetchSection105Pending()
      return response.data && Array.isArray(response.data)
        ? response.data.map((d: any) => {
            return new CompanyShareholderTransfer(d)
          })
        : []
    } catch (e: any) {
      console.error(`Failed to fetch data for pending Section 105`, e)
      error.value = `Failed to fetch data for pending Section 105`
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function addShareTransferDetails(id: string, data: object): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.addShareTransferDetails(id, data)
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to add new details for transfer id ${id}`, e)
      error.value = `Failed to add new details for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateShareTransferDetails(
    transferDetailId: string,
    data: object
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.updateShareTransferDetails(
        transferDetailId,
        data
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update details for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update details for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function removeShareTransferDetails(transferDetailId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.removeShareTransferDetails(transferDetailId)
      return response
    } catch (e: any) {
      console.error(`Failed to remove transfer detail id ${transferDetailId}`, e)
      error.value = `Failed to remove transfer detail`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transferorConsented(
    transferDetailId: string,
    isConsented: boolean
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transferorConsented(
        transferDetailId,
        isConsented
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferor consent for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferor consent for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transferorSigned(
    transferDetailId: string,
    signatureFileId: string
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transferorSigned(
        transferDetailId,
        signatureFileId
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferor signed for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferor signed for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transferorRepSigned(
    transferDetailId: string,
    signatureFileId: string,
    repName: string,
    repIdentification: string
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transferorRepSigned(
        transferDetailId,
        signatureFileId,
        repName,
        repIdentification
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferor rep signature for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferor rep signature for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transfereeConsented(
    transferDetailId: string,
    isConsented: boolean
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transfereeConsented(
        transferDetailId,
        isConsented
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferee consent for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferee consent for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transfereeSigned(
    transferDetailId: string,
    signatureFileId: string
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transfereeSigned(
        transferDetailId,
        signatureFileId
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferee signed for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferee signed for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function transfereeRepSigned(
    transferDetailId: string,
    signatureFileId: string,
    repName: string,
    repIdentification: string
  ): Promise<CompanyShareTransferDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyShareholderTransfers.transfereeRepSigned(
        transferDetailId,
        signatureFileId,
        repName,
        repIdentification
      )
      return response.data ? new CompanyShareTransferDetail(response.data) : null
    } catch (e: any) {
      console.error(`Failed to update transferee rep signature for transfer id ${transferDetailId}`, e)
      error.value = `Failed to update transferee rep signature for transfer`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyShareholderTransfers = computed(() => companyShareholderTransfers.value.length)

  return {
    companyShareholderTransfers,
    companyShareholderTransfer,
    isLoading,
    error,
    totalCompanyShareholderTransfers,
    ...crudActions,
    lodge,
    paymentReceived,
    paymentMade,
    fetchSection105Data,
    fetchSection105DataForPublic,
    fetchSection105Pending,
    addShareTransferDetails,
    updateShareTransferDetails,
    removeShareTransferDetails,
    transferorConsented,
    transferorSigned,
    transferorRepSigned,
    transfereeConsented,
    transfereeSigned,
    transfereeRepSigned,
  }
})
