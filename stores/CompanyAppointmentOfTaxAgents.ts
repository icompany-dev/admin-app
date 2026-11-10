import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"

export const useCompanyAppointmentOfTaxAgentStore = defineStore("companyAppointmentOfTaxAgent", () => {
  const { $repositories } = useNuxtApp()

  const companyAppointmentOfTaxAgents = ref<CompanyAppointmentOfTaxAgent[]>([])
  const companyAppointmentOfTaxAgent = ref<CompanyAppointmentOfTaxAgent | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.companyAppointmentOfTaxAgents, {
    items: companyAppointmentOfTaxAgents,
    item: companyAppointmentOfTaxAgent,
    isLoading: isLoading,
    error: error,
  })

  const totalCompanyAppointmentOfTaxAgents = computed(() => companyAppointmentOfTaxAgents.value.length)

  return {
    companyAppointmentOfTaxAgents,
    companyAppointmentOfTaxAgent,
    isLoading,
    error,
    totalCompanyAppointmentOfTaxAgents,
    ...crudActions
  }
})
