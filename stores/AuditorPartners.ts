import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { AuditorPartner } from "~/scripts/models/AuditorPartner"

export const useAuditorPartnerStore = defineStore("auditorPartner", () => {
  const { $repositories } = useNuxtApp()

  const auditorPartners = ref<AuditorPartner[]>([])
  const auditorPartner = ref<AuditorPartner | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.auditorPartners, {
    items: auditorPartners,
    item: auditorPartner,
    isLoading: isLoading,
    error: error,
  })

  const totalAuditorPartners = computed(() => auditorPartners.value.length)

  return {
    auditorPartners,
    auditorPartner,
    isLoading,
    error,
    totalAuditorPartners,
    ...crudActions
  }
})
