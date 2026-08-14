import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyMeeting } from "~/scripts/models/CompanyMeeting"

export const useCompanyMeetingStore = defineStore("companyMeeting", () => {
  const { $repositories } = useNuxtApp()

  const companyMeetings = ref<CompanyMeeting[]>([])
  const companyMeeting = ref<CompanyMeeting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyMeetings, {
    items: companyMeetings,
    item: companyMeeting,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyMeetings = computed(() => companyMeetings.value.length)

  return {
    companyMeetings,
    companyMeeting,
    isLoading,
    error,
    totalCompanyMeetings,
    ...crudActions
  }
})
