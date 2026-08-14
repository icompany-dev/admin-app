import { defineStore } from "pinia"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useApplicationSwitchStore = defineStore("applicationSwitch", () => {
  const { $repositories } = useNuxtApp()

  const applicationSwitches = ref<ApplicationSwitch[]>([])
  const applicationSwitch = ref<ApplicationSwitch | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.applicationSwitches, {
    items: applicationSwitches,
    item: applicationSwitch,
    isLoading: isLoading,
    error: error,
  })

  async function fetchAllOld(slug: string | null): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      applicationSwitches.value = []
      const response: any = await $repositories.applicationSwitches.fetchAllOld(slug)
      if (response.data) {
        applicationSwitches.value.push(new ApplicationSwitch(response.data))
      }
    } catch (e: any) {
      error.value = e.message || `Failed to fetch applicationSwitches for user`
      console.error(`Error to fetch applicationSwitches for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function sendEmailToPreviousCosec(id: string, fileId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      applicationSwitches.value = []
      const response: any = await $repositories.applicationSwitches.sendEmailToPreviousCosec(id, fileId)
      return response
    } catch (e: any) {
      error.value = e.message || `Failed to fetch applicationSwitches for user`
      console.error(`Error to fetch applicationSwitches for user`, e)
    } finally {
      isLoading.value = false
    }
  }

  async function ongoingApplication(): Promise<ApplicationSwitch | null> {
    isLoading.value = true
    error.value = null

    try {
      const response: any = await $repositories.applicationSwitches.ongoingApplication()
      return new ApplicationSwitch(response.data)
    } catch (e: any) {
      error.value = e.message || `Failed to fetch applicationSwitches for user`
      console.error(`Error to fetch applicationSwitches for user`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalApplicationSwitchs = computed(() => applicationSwitches.value.length)

  return {
    applicationSwitches: applicationSwitches,
    applicationSwitch,
    isLoading,
    error,
    totalApplicationSwitchs,
    ...crudActions,
    fetchAllOld,
    sendEmailToPreviousCosec,
    ongoingApplication,
  }
})
