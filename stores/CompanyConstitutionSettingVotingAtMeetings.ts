import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingVotingAtMeeting } from "~/scripts/models/CompanyConstitutionSettingVotingAtMeeting"

export const useCompanyConstitutionSettingVotingAtMeetingStore = defineStore(
  "companyConstitutionSettingVotingAtMeeting",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingVotingAtMeetings = ref<CompanyConstitutionSettingVotingAtMeeting[]>([])
    const companyConstitutionSettingVotingAtMeeting = ref<CompanyConstitutionSettingVotingAtMeeting | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingVotingAtMeetings, {
      items: companyConstitutionSettingVotingAtMeetings,
      item: companyConstitutionSettingVotingAtMeeting,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingVotingAtMeetings = computed(
      () => companyConstitutionSettingVotingAtMeetings.value.length
    )

    return {
      companyConstitutionSettingVotingAtMeetings,
      companyConstitutionSettingVotingAtMeeting,
      isLoading,
      error,
      totalCompanyConstitutionSettingVotingAtMeetings,
      ...crudActions,
    }
  }
)
