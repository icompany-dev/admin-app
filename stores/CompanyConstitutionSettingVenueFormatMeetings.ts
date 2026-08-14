import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingVenueFormatMeeting } from "~/scripts/models/CompanyConstitutionSettingVenueFormatMeeting"

export const useCompanyConstitutionSettingVenueFormatMeetingStore = defineStore(
  "companyConstitutionSettingVenueFormatMeeting",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingVenueFormatMeetings = ref<CompanyConstitutionSettingVenueFormatMeeting[]>([])
    const companyConstitutionSettingVenueFormatMeeting = ref<CompanyConstitutionSettingVenueFormatMeeting | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingVenueFormatMeetings, {
      items: companyConstitutionSettingVenueFormatMeetings,
      item: companyConstitutionSettingVenueFormatMeeting,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingVenueFormatMeetings = computed(
      () => companyConstitutionSettingVenueFormatMeetings.value.length
    )

    return {
      companyConstitutionSettingVenueFormatMeetings,
      companyConstitutionSettingVenueFormatMeeting,
      isLoading,
      error,
      totalCompanyConstitutionSettingVenueFormatMeetings,
      ...crudActions,
    }
  }
)
