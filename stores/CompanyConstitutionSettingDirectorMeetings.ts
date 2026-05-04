import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingDirectorMeeting } from "~/scripts/models/CompanyConstitutionSettingDirectorMeeting"

export const useCompanyConstitutionSettingDirectorMeetingStore = defineStore(
  "companyConstitutionSettingDirectorMeeting",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingDirectorMeetings = ref<CompanyConstitutionSettingDirectorMeeting[]>([])
    const companyConstitutionSettingDirectorMeeting = ref<CompanyConstitutionSettingDirectorMeeting | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingDirectorMeetings, {
      items: companyConstitutionSettingDirectorMeetings,
      item: companyConstitutionSettingDirectorMeeting,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingDirectorMeetings = computed(
      () => companyConstitutionSettingDirectorMeetings.value.length
    )

    return {
      companyConstitutionSettingDirectorMeetings,
      companyConstitutionSettingDirectorMeeting,
      isLoading,
      error,
      totalCompanyConstitutionSettingDirectorMeetings,
      ...crudActions,
    }
  }
)
