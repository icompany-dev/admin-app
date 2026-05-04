import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingBusinessGeneralMeeting } from "~/scripts/models/CompanyConstitutionSettingBusinessGeneralMeeting"

export const useCompanyConstitutionSettingBusinessGeneralMeetingStore = defineStore(
  "companyConstitutionSettingBusinessGeneralMeeting",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingBusinessGeneralMeetings = ref<CompanyConstitutionSettingBusinessGeneralMeeting[]>(
      []
    )
    const companyConstitutionSettingBusinessGeneralMeeting =
      ref<CompanyConstitutionSettingBusinessGeneralMeeting | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingBusinessGeneralMeetings, {
      items: companyConstitutionSettingBusinessGeneralMeetings,
      item: companyConstitutionSettingBusinessGeneralMeeting,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingBusinessGeneralMeetings = computed(
      () => companyConstitutionSettingBusinessGeneralMeetings.value.length
    )

    return {
      companyConstitutionSettingBusinessGeneralMeetings,
      companyConstitutionSettingBusinessGeneralMeeting,
      isLoading,
      error,
      totalCompanyConstitutionSettingBusinessGeneralMeetings,
      ...crudActions,
    }
  }
)
