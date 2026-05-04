import { defineStore } from "pinia"
import { User } from "~/scripts/models/User"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import type { Company } from "~/scripts/models/Company"
import type { ApiRecord } from "~/scripts/library/ApiRecord"

export const useUserStore = defineStore("user", () => {
  const { $repositories } = useNuxtApp()

  const users = ref<User[]>([])
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.users, {
    items: users,
    item: user,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByEmail(email: string): Promise<User | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.users.fetchByEmail(email)
      return new User(response.data)
    } catch (e: any) {
      error.value = e.message || `Failed to fetch users by email`
      console.error(`Error to fetch users by email`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function checkExists(email: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.users.checkExists(email)
      return response.exists
    } catch (e: any) {
      error.value = e.message || `Failed to fetch users by email`
      console.error(`Error to fetch users by email`, e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchByIdentification(identification: string, type: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchByIdentification(identification, type)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch users by email`
      console.error(`Error to fetch users by email`, e)
    }
  }

  async function fetchDirectorship(): Promise<ApiRecord<Company> | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchDirectorship()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch company by directorship`
      console.error(`Error to fetch company by shareholding`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchShareholding(): Promise<ApiRecord<Company> | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchShareholding()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch company by shareholding`
      console.error(`Error to fetch company by shareholding`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRepresentative(): Promise<ApiRecord<Company> | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchRepresentative()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch company by corporate representative`
      console.error(`Error to fetch company by corporate representative`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDirectorToCompany(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchDirectorToCompany(companyId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch director details for company`
      console.error(`Error to fetch director details for company`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRoles(): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.users.fetchRoles()
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch roles`
      console.error(`Error to fetch roles`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    user,
    isLoading,
    error,
    ...crudActions,
    fetchByEmail,
    checkExists,
    fetchByIdentification,
    fetchDirectorship,
    fetchShareholding,
    fetchRepresentative,
    fetchDirectorToCompany,
    fetchRoles,
  }
})
