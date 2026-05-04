import { defineStore } from "pinia"
import { Model } from "~/scripts/models/Model"
import { useNuxtApp } from "#app"
import { Filter } from "~/scripts/library/Filter"
import { MyDataDocuments } from "~/scripts/models/MyDataDocuments"
import { MyDataPurchaseCorporateProfileResponse } from "~/scripts/models/MyDataPurchaseCorporateProfileResponse"

export const useMyDataStore = defineStore("myData", () => {
  const { $repositories } = useNuxtApp()

  const myDatas = ref<Model[]>([])
  const myData = ref<Model | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllDocuments(filter: Filter): Promise<MyDataDocuments | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.myData.fetchAllDocuments(filter)
      return new MyDataDocuments(response.data ?? null)
    } catch (e: any) {
      error.value = e.message || `Failed to fetch myDatas for company`
      console.error(`Error to fetch myDatas by company id`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function purchaseCorporateProfile(
    registrationNumberOld: string,
    registrationNumberNew: string
  ): Promise<MyDataPurchaseCorporateProfileResponse | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.myData.purchaseCorporateProfile(registrationNumberOld, registrationNumberNew)
      return new MyDataPurchaseCorporateProfileResponse(response)
    } catch (e: any) {
      error.value = e.message || `Failed to purchase SSM Corporate Profile for company`
      console.error(`Error to purchase SSM Corporte Profile for company`, e)
      return null
    } finally {
      isLoading.value
    }
  }

  async function fetchPurchasedCorporateProfileJson(orderNumber: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.myData.fetchPurchasedCorporateProfileJson(orderNumber)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to purchase SSM Corporate Profile for company`
      console.error(`Error to purchase SSM Corporte Profile for company`, e)
      return null
    } finally {
      isLoading.value
    }
  }

  async function fetchPurchasedCorporateProfilePdf(orderNumber: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.myData.fetchPurchasedCorporateProfilePdf(orderNumber)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to purchase SSM Corporate Profile for company`
      console.error(`Error to purchase SSM Corporte Profile for company`, e)
      return null
    } finally {
      isLoading.value
    }
  }

  const totalModels = computed(() => myDatas.value.length)

  return {
    myDatas,
    myData,
    isLoading,
    error,
    totalModels,
    fetchAllDocuments,
    purchaseCorporateProfile,
    fetchPurchasedCorporateProfileJson,
    fetchPurchasedCorporateProfilePdf,
  }
})
