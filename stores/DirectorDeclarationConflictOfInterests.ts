export enum DividendDeclarationType {
  Immediate = "immediate",
  FourteenDays = "fourteen-days",
}
import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { DirectorDeclarationConflictOfInterest } from "~/scripts/models/DirectorDeclarationConflictOfInterest"

export const useDirectorDeclarationConflictOfInterestStore = defineStore(
  "directorDeclarationConflictOfInterest",
  () => {
    const { $repositories } = useNuxtApp()

    const directorDeclarationConflictOfInterests = ref<DirectorDeclarationConflictOfInterest[]>([])
    const directorDeclarationConflictOfInterest = ref<DirectorDeclarationConflictOfInterest | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const crudActions = useStoreActions($repositories.directorDeclarationConflictOfInterests, {
      items: directorDeclarationConflictOfInterests,
      item: directorDeclarationConflictOfInterest,
      isLoading: isLoading,
      error: error,
    })

    async function ongoingForDirector(directorId: string): Promise<any> {
      isLoading.value = true
      error.value = null

      try {
        let response = await $repositories.directorDeclarationConflictOfInterests.ongoingForDirector(directorId)
        return response.data ?? null
      } catch (e) {
        error.value = "failed to fetch data for director"
        return null
      } finally {
        isLoading.value = false
      }
    }

    async function activeForDirector(directorId: string): Promise<any> {
      isLoading.value = true
      error.value = null

      try {
        let response = await $repositories.directorDeclarationConflictOfInterests.activeForDirector(directorId)
        return response.data ?? null
      } catch (e) {
        error.value = "failed to fetch data for director"
        return null
      } finally {
        isLoading.value = false
      }
    }

    async function overridenForDirector(directorId: string): Promise<any> {
      isLoading.value = true
      error.value = null

      try {
        let response = await $repositories.directorDeclarationConflictOfInterests.overridenForDirector(directorId)
        return response.data ?? null
      } catch (e) {
        error.value = "failed to fetch data for director"
        return null
      } finally {
        isLoading.value = false
      }
    }

    async function allForDirector(directorId: string): Promise<any> {
      isLoading.value = true
      error.value = null

      try {
        let response = await $repositories.directorDeclarationConflictOfInterests.allForDirector(directorId)
        return response.data ?? null
      } catch (e) {
        error.value = "failed to fetch data for director"
        return null
      } finally {
        isLoading.value = false
      }
    }

    async function submitSignature(id: string, signatureId: string): Promise<any> {
      isLoading.value = true
      error.value = null

      try {
        let response = await $repositories.directorDeclarationConflictOfInterests.submitSignature(id, signatureId)
        return response.data ?? null
      } catch (e) {
        error.value = "failed to fetch data for director"
        return null
      } finally {
        isLoading.value = false
      }
    }

    const totalDirectorDeclarationConflictOfInterests = computed(
      () => directorDeclarationConflictOfInterests.value.length
    )

    return {
      directorDeclarationConflictOfInterests,
      directorDeclarationConflictOfInterest,
      isLoading,
      error,
      totalDirectorDeclarationConflictOfInterests,
      ...crudActions,
      ongoingForDirector,
      activeForDirector,
      overridenForDirector,
      allForDirector,
      submitSignature,
    }
  }
)
