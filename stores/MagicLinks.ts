import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { MagicLink } from "~/scripts/models/MagicLink"

export const useMagicLinkStore = defineStore("magicLink", () => {
  const { $repositories } = useNuxtApp()

  const magicLinks = ref<MagicLink[]>([])
  const magicLink = ref<MagicLink | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(id: string): Promise<any> {
    isLoading.value = true
    error.value = null

    try {
      const fetchedItem: any = await $repositories.magicLinks.fetch(id)
      return fetchedItem
    } catch (e: any) {
      console.error(`Error in fetch(${id}):`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const totalMagicLinks = computed(() => magicLinks.value.length)

  return {
    magicLinks,
    magicLink,
    isLoading,
    error,
    totalMagicLinks,
    fetch,
  }
})
