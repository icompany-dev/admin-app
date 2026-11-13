import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { AdminEmail } from "~/scripts/models/AdminEmail"

export const useAdminEmailStore = defineStore("adminEmail", () => {
  const { $repositories } = useNuxtApp()

  const adminEmails = ref<AdminEmail[]>([])
  const adminEmail = ref<AdminEmail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // const crudActions = useStoreActions($repositories.adminEmails, {
  //   items: adminEmails,
  //   item: adminEmail,
  //   isLoading: isLoading,
  //   error: error,
  // })

  async function sendEmail(data: object): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      let response = await $repositories.adminEmails.sendEmail(data)
      return response
    } catch (e) {
      console.error(`Failed to send email: ${e}`)
      error.value = `Failed to send email: ${e}`
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalAdminEmails = computed(() => adminEmails.value.length)

  return {
    adminEmails,
    adminEmail,
    isLoading,
    error,
    totalAdminEmails,
    // ...crudActions
    sendEmail,
  }
})
