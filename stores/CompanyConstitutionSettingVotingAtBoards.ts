import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingVotingAtBoard } from "~/scripts/models/CompanyConstitutionSettingVotingAtBoard"

export const useCompanyConstitutionSettingVotingAtBoardStore = defineStore("companyConstitutionSettingVotingAtBoard", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingVotingAtBoards = ref<CompanyConstitutionSettingVotingAtBoard[]>([])
  const companyConstitutionSettingVotingAtBoard = ref<CompanyConstitutionSettingVotingAtBoard | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingVotingAtBoards, {
    items: companyConstitutionSettingVotingAtBoards,
    item: companyConstitutionSettingVotingAtBoard,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingVotingAtBoards = computed(() => companyConstitutionSettingVotingAtBoards.value.length)

  return {
    companyConstitutionSettingVotingAtBoards,
    companyConstitutionSettingVotingAtBoard,
    isLoading,
    error,
    totalCompanyConstitutionSettingVotingAtBoards,
    ...crudActions
  }
})
