import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingQuorumForBoard } from "~/scripts/models/CompanyConstitutionSettingQuorumForBoard"

export const useCompanyConstitutionSettingQuorumForBoardStore = defineStore("companyConstitutionSettingQuorumForBoard", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettingQuorumForBoards = ref<CompanyConstitutionSettingQuorumForBoard[]>([])
  const companyConstitutionSettingQuorumForBoard = ref<CompanyConstitutionSettingQuorumForBoard | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettingQuorumForBoards, {
    items: companyConstitutionSettingQuorumForBoards,
    item: companyConstitutionSettingQuorumForBoard,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyConstitutionSettingQuorumForBoards = computed(() => companyConstitutionSettingQuorumForBoards.value.length)

  return {
    companyConstitutionSettingQuorumForBoards,
    companyConstitutionSettingQuorumForBoard,
    isLoading,
    error,
    totalCompanyConstitutionSettingQuorumForBoards,
    ...crudActions
  }
})
