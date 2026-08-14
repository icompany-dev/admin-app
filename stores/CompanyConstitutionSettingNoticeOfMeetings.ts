import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingNoticeOfMeeting } from "~/scripts/models/CompanyConstitutionSettingNoticeOfMeeting"

export const useCompanyConstitutionSettingNoticeOfMeetingStore = defineStore("companyConstitutionSettingNoticeOfMeeting", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingNoticeOfMeetings = ref<CompanyConstitutionSettingNoticeOfMeeting[]>([])
  const companyConstitutionSettingNoticeOfMeeting = ref<CompanyConstitutionSettingNoticeOfMeeting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingNoticeOfMeetings, {
    items: companyConstitutionSettingNoticeOfMeetings,
    item: companyConstitutionSettingNoticeOfMeeting,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingNoticeOfMeetings = computed(() => companyConstitutionSettingNoticeOfMeetings.value.length)

  return {
    companyConstitutionSettingNoticeOfMeetings,
    companyConstitutionSettingNoticeOfMeeting,
    isLoading,
    error,
    totalCompanyConstitutionSettingNoticeOfMeetings,
    ...crudActions
  }
})
