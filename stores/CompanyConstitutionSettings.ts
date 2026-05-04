import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSetting } from "~/scripts/models/CompanyConstitutionSetting"

export const useCompanyConstitutionSettingStore = defineStore("companyConstitutionSetting", () => {
  const { $repositories } = useNuxtApp()

  const companyConstitutionSettings = ref<CompanyConstitutionSetting[]>([])
  const companyConstitutionSetting = ref<CompanyConstitutionSetting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyConstitutionSettings, {
    items: companyConstitutionSettings,
    item: companyConstitutionSetting,
    isLoading: isLoading,
    error: error,
  })

  async function adopt(id: string): Promise<CompanyConstitutionSetting | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutionSettings.adopt(id)
      return new CompanyConstitutionSetting(response.data)
    } catch (e) {
      console.error("Failed to adopt constitution", e)
      error.value = `Failed to adopt constitution: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function amend(id: string): Promise<CompanyConstitutionSetting | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutionSettings.amend(id)
      return new CompanyConstitutionSetting(response.data)
    } catch (e) {
      console.error("Failed to amend constitution", e)
      error.value = `Failed to amend constitution: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function abolish(companyId: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyConstitutionSettings.abolish(companyId)
      return response
    } catch (e) {
      console.error("Failed to abolish constitution for company", e)
      error.value = `Failed to abolish constitution for company: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyAmendmentConstitutions = computed(() => companyConstitutionSettings.value.length)

  return {
    companyConstitutionSettings,
    companyConstitutionSetting,
    isLoading,
    error,
    totalCompanyAmendmentConstitutions,
    ...crudActions,
    adopt,
    amend,
    abolish,
  }
})
