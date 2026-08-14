import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyStrikingOffRegistrarLetter } from "~/scripts/models/CompanyStrikingOffRegistrarLetter"

export const useCompanyStrikingOffRegistrarLetterStore = defineStore("companyStrikingOffRegistrarLetter", () => {
  const { $repositories } = useNuxtApp()

  const companyStrikingOffRegistrarLetters = ref<CompanyStrikingOffRegistrarLetter[]>([])
  const companyStrikingOffRegistrarLetter = ref<CompanyStrikingOffRegistrarLetter | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyStrikingOffRegistrarLetters, {
    items: companyStrikingOffRegistrarLetters,
    item: companyStrikingOffRegistrarLetter,
    isLoading: isLoading,
    error: error,
  })

  async function customCreate(
    strikingOffResolutionId: string,
    data: object
  ): Promise<CompanyStrikingOffRegistrarLetter | null> {
    isLoading.value = true
    error.value = null

    try {
      let response: any = await $repositories.companyStrikingOffRegistrarLetters.create(strikingOffResolutionId, data)
      return new CompanyStrikingOffRegistrarLetter(response.data)
    } catch (e) {
      console.error("failed to create application")
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyStrikingOffRegistrarLetters = computed(() => companyStrikingOffRegistrarLetters.value.length)

  return {
    companyStrikingOffRegistrarLetters,
    companyStrikingOffRegistrarLetter,
    isLoading,
    error,
    totalCompanyStrikingOffRegistrarLetters,
    ...crudActions,
    customCreate,
  }
})
