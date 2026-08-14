import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyConstitutionSettingTransmissionOfSharesByLaw } from "~/scripts/models/CompanyConstitutionSettingTransmissionOfSharesByLaw"

export const useCompanyConstitutionSettingTransmissionOfSharesByLawStore = defineStore(
  "companyConstitutionSettingTransmissionOfSharesByLaw",
  () => {
    const { $repositories } = useNuxtApp()

    const companyConstitutionSettingTransmissionOfSharesByLaws = ref<
      CompanyConstitutionSettingTransmissionOfSharesByLaw[]
    >([])
    const companyConstitutionSettingTransmissionOfSharesByLaw =
      ref<CompanyConstitutionSettingTransmissionOfSharesByLaw | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.companyConstitutionSettingTransmissionOfSharesByLaws, {
      items: companyConstitutionSettingTransmissionOfSharesByLaws,
      item: companyConstitutionSettingTransmissionOfSharesByLaw,
      isLoading: isLoading,
      error: error,
    })

    const totalCompanyConstitutionSettingTransmissionOfSharesByLaws = computed(
      () => companyConstitutionSettingTransmissionOfSharesByLaws.value.length
    )

    return {
      companyConstitutionSettingTransmissionOfSharesByLaws,
      companyConstitutionSettingTransmissionOfSharesByLaw,
      isLoading,
      error,
      totalCompanyConstitutionSettingTransmissionOfSharesByLaws,
      ...crudActions,
    }
  }
)
