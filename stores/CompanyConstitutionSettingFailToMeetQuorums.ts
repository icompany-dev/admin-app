import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingFailToMeetQuorum } from "~/scripts/models/CompanyConstitutionSettingFailToMeetQuorum"

export const useCompanyConstitutionSettingFailToMeetQuorumStore = defineStore("companyConstitutionSettingFailToMeetQuorum", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingFailToMeetQuorums = ref<CompanyConstitutionSettingFailToMeetQuorum[]>([])
  const companyConstitutionSettingFailToMeetQuorum = ref<CompanyConstitutionSettingFailToMeetQuorum | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingFailToMeetQuorums, {
    items: companyConstitutionSettingFailToMeetQuorums,
    item: companyConstitutionSettingFailToMeetQuorum,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingFailToMeetQuorums = computed(() => companyConstitutionSettingFailToMeetQuorums.value.length)

  return {
    companyConstitutionSettingFailToMeetQuorums,
    companyConstitutionSettingFailToMeetQuorum,
    isLoading,
    error,
    totalCompanyConstitutionSettingFailToMeetQuorums,
    ...crudActions
  }
})
