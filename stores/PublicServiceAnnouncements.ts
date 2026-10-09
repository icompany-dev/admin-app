import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { PublicServiceAnnouncement } from "~/scripts/models/PublicServiceAnnouncement"

export const usePublicServiceAnnouncementStore = defineStore("publicServiceAnnouncement", () => {
  const { $repositories } = useNuxtApp()

  const publicServiceAnnouncements = ref<PublicServiceAnnouncement[]>([])
  const publicServiceAnnouncement = ref<PublicServiceAnnouncement | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.publicServiceAnnouncements, {
    items: publicServiceAnnouncements,
    item: publicServiceAnnouncement,
    isLoading: isLoading,
    error: error,
  })

  const totalPublicServiceAnnouncements = computed(() => publicServiceAnnouncements.value.length)

  return {
    publicServiceAnnouncements,
    publicServiceAnnouncement,
    isLoading,
    error,
    totalPublicServiceAnnouncements,
    ...crudActions
  }
})
