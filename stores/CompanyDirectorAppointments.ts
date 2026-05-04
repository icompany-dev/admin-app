import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"

export const useCompanyDirectorAppointmentStore = defineStore("companyDirectorAppointment", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorAppointments = ref<CompanyDirectorAppointment[]>([])
  const companyDirectorAppointment = ref<CompanyDirectorAppointment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorAppointments, {
    items: companyDirectorAppointments,
    item: companyDirectorAppointment,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDirectorAppointments = computed(() => companyDirectorAppointments.value.length)

  return {
    companyDirectorAppointments,
    companyDirectorAppointment,
    isLoading,
    error,
    totalCompanyDirectorAppointments,
    ...crudActions,
  }
})
