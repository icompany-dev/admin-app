import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyMeetingAcknowledgement } from "~/scripts/models/CompanyMeetingAcknowledgement"

export const useCompanyMeetingAcknowledgementStore = defineStore("companyMeetingAcknowledgement", () => {
  const { $repositories } = useNuxtApp()

  const companyMeetingAcknowledgements = ref<CompanyMeetingAcknowledgement[]>([])
  const companyMeetingAcknowledgement = ref<CompanyMeetingAcknowledgement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyMeetingAcknowledgements, {
    items: companyMeetingAcknowledgements,
    item: companyMeetingAcknowledgement,
    isLoading: isLoading,
    error: error,
  })

  async function fetchByMeetingIdShareholderId(
    meetingId: string,
    shareholderId: string
  ): Promise<CompanyMeetingAcknowledgement | null> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyMeetingAcknowledgements.fetchByMeetingIdShareholderId(
        meetingId,
        shareholderId
      )
      if (!response.data) {
        return null
      }

      return new CompanyMeetingAcknowledgement(response.data)
    } catch (e) {
      error.value = `Failed to get record: ${e}`
      console.error("Failed to get record", e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllByMeetingId(meetingId: string): Promise<CompanyMeetingAcknowledgement[]> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.companyMeetingAcknowledgements.fetchAllByMeetingId(meetingId)
      if (!response.data || !Array.isArray(response.data)) {
        return []
      }

      return response.data.map((d: any) => {
        return new CompanyMeetingAcknowledgement(d)
      })
    } catch (e) {
      error.value = `Failed to get record: ${e}`
      console.error("Failed to get record", e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyMeetingAcknowledgements = computed(() => companyMeetingAcknowledgements.value.length)

  return {
    companyMeetingAcknowledgements,
    companyMeetingAcknowledgement,
    isLoading,
    error,
    totalCompanyMeetingAcknowledgements,
    ...crudActions,
    fetchByMeetingIdShareholderId,
    fetchAllByMeetingId,
  }
})
