import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingConveningMeeting } from "~/scripts/models/CompanyConstitutionSettingConveningMeeting"

export const useCompanyConstitutionSettingConveningMeetingStore = defineStore(
  "companyConstitutionSettingConveningMeeting",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingConveningMeetings = ref<CompanyConstitutionSettingConveningMeeting[]>([])
    const companyConstitutionSettingConveningMeeting = ref<CompanyConstitutionSettingConveningMeeting | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingConveningMeetings, {
      items: companyConstitutionSettingConveningMeetings,
      item: companyConstitutionSettingConveningMeeting,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingConveningMeetings = computed(
      () => companyConstitutionSettingConveningMeetings.value.length
    )

    return {
      companyConstitutionSettingConveningMeetings,
      companyConstitutionSettingConveningMeeting,
      isLoading,
      error,
      totalCompanyConstitutionSettingConveningMeetings,
      ...crudActions,
    }
  }
)
