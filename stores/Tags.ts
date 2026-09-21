import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { Tag } from "~/scripts/models/Tag"

export const useTagStore = defineStore("tag", () => {
  const { $repositories } = useNuxtApp()

  const tags = ref<Tag[]>([])
  const tag = ref<Tag | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.tags, {
    items: tags,
    item: tag,
    isLoading: isLoading,
    error: error,
  })

  const totalTags = computed(() => tags.value.length)

  return {
    tags,
    tag,
    isLoading,
    error,
    totalTags,
    ...crudActions
  }
})
