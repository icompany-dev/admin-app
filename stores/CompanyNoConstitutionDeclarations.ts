import { defineStore } from "pinia"
import { CompanyNoConstitutionDeclaration } from "~/scripts/models/CompanyNoConstitutionDeclaration"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"

export const useCompanyNoConstitutionDeclarationStore = defineStore("companyNoConstitutionDeclaration", () => {
  const { $repositories } = useNuxtApp()

  const companyNoConstitutionDeclarations = ref<CompanyNoConstitutionDeclaration[]>([])
  const companyNoConstitutionDeclaration = ref<CompanyNoConstitutionDeclaration | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyNoConstitutionDeclarations, {
    items: companyNoConstitutionDeclarations,
    item: companyNoConstitutionDeclaration,
    isLoading: isLoading,
    error: error,
  })

  async function email(
    id: string,
    name: string,
    email: string,
    fileUrl: string
  ): Promise<CompanyNoConstitutionDeclaration | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNoConstitutionDeclarations.email(id, name, email, fileUrl)
      return new CompanyNoConstitutionDeclaration(response)
    } catch (e) {
      error.value = `Fail to email document: ${e}`
      console.error(error.value)

      return null
    } finally {
      isLoading.value = false
    }
  }

  async function download(id: string): Promise<CompanyNoConstitutionDeclaration | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await $repositories.companyNoConstitutionDeclarations.download(id)
      return new CompanyNoConstitutionDeclaration(response)
    } catch (e) {
      error.value = `Fail to email document: ${e}`
      console.error(error.value)

      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalCompanyNoConstitutionDeclarations = computed(() => companyNoConstitutionDeclarations.value.length)

  return {
    companyNoConstitutionDeclarations,
    companyNoConstitutionDeclaration,
    isLoading,
    error,
    totalCompanyNoConstitutionDeclarations,
    ...crudActions,
    email,
    download,
  }
})
