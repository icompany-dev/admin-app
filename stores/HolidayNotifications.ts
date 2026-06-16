import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { HolidayNotification } from "~/scripts/models/HolidayNotification"

export const useHolidayNotificationStore = defineStore("holidayNotification", () => {
  const { $repositories } = useNuxtApp()

  const holidayNotifications = ref<HolidayNotification[]>([])
  const holidayNotification = ref<HolidayNotification | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.holidayNotifications, {
    items: holidayNotifications,
    item: holidayNotification,
    isLoading: isLoading,
    error: error,
  })

  const totalHolidayNotifications = computed(() => holidayNotifications.value.length)

  return {
    holidayNotifications,
    holidayNotification,
    isLoading,
    error,
    totalHolidayNotifications,
    ...crudActions
  }
})
