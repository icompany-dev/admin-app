import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyDirectorManagerAppointment } from "~/scripts/models/CompanyDirectorManagerAppointment"

export const useCompanyDirectorManagerAppointmentStore = defineStore("companyDirectorManagerAppointment", () => {
  const { $repositories } = useNuxtApp()

  const companyDirectorManagerAppointments = ref<CompanyDirectorManagerAppointment[]>([])
  const companyDirectorManagerAppointment = ref<CompanyDirectorManagerAppointment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyDirectorManagerAppointments, {
    items: companyDirectorManagerAppointments,
    item: companyDirectorManagerAppointment,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyDirectorManagerAppointments = computed(() => companyDirectorManagerAppointments.value.length)

  return {
    companyDirectorManagerAppointments,
    companyDirectorManagerAppointment,
    isLoading,
    error,
    totalCompanyDirectorManagerAppointments,
    ...crudActions
  }
})
