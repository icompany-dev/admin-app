import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"

export const useCompanyAuditorAppointmentStore = defineStore("companyAuditorAppointment", () => {
  const { $repositories } = useNuxtApp()

  const companyAuditorAppointments = ref<CompanyAuditorAppointment[]>([])
  const companyAuditorAppointment = ref<CompanyAuditorAppointment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAuditorAppointments, {
    items: companyAuditorAppointments,
    item: companyAuditorAppointment,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAuditorAppointments = computed(() => companyAuditorAppointments.value.length)

  async function fetchLast(companyId: string): Promise<CompanyAuditorAppointment> {
    isLoading.value = true
    error.value = null
    try {
      const lastAppointment = await $repositories.companyAuditorAppointments.fetchLast(companyId)
      const appointment = new CompanyAuditorAppointment(lastAppointment)
      companyAuditorAppointment.value = appointment
      return appointment
    } catch (e: any) {
      error.value = e.message || "Failed to fetch last auditor appointment."
      console.error("Error in fetchLast:", e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    companyAuditorAppointments,
    companyAuditorAppointment,
    isLoading,
    error,
    totalCompanyAuditorAppointments,
    fetchLast,
    ...crudActions,
  }
})
