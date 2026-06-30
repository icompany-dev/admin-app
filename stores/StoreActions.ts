import { computed, ref } from "vue"
import { useNuxtApp } from "#app"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { Filter } from "~/scripts/library/Filter"
import type { Repository } from "~/scripts/repositories/Repository"

export function useStoreActions<T extends { id?: string | number }>(
  repository: Repository<T>,
  storeStateRefs: {
    items: Ref<T[]>
    item: Ref<T | null>
    isLoading: Ref<boolean>
    error: Ref<string | null>
  }
) {
  const { items, item, isLoading, error } = storeStateRefs

  function setProcessingState(loading: boolean, err: string | null = null) {
    isLoading.value = loading
    error.value = err
  }

  async function fetchAll(filter: Filter = new (Filter as any)()): Promise<ApiRecord<T>> {
    setProcessingState(true)
    try {
      const apiRecord: ApiRecord<T> = await repository.fetchAll<T>(filter)
      items.value = apiRecord.data
      return apiRecord
    } catch (e: any) {
      setProcessingState(false, e.message || "Failed to fetch all items.")
      console.error("Error in fetchAll:", e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function fetch(id: string | number): Promise<T> {
    setProcessingState(true)
    try {
      if (item.value && item.value.id === id) {
        return item.value // speed up the time.
      }

      const fetchedItem: T = await repository.fetch<T>(id)
      item.value = fetchedItem
      return fetchedItem
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to fetch item with ID: ${id}.`)
      console.error(`Error in fetch(${id}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function create(data: object): Promise<T> {
    setProcessingState(true)
    try {
      const newItem: T = await repository.store<T>(data)
      items.value.push(newItem)
      item.value = newItem // Optionally set as current item
      return newItem
    } catch (e: any) {
      setProcessingState(false, e.message || "Failed to create item.")
      console.error("Error in create:", e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function update(id: string | number, data: object): Promise<T> {
    setProcessingState(true)
    try {
      const updatedItem: T = await repository.update<T>(id, data)
      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      if (item.value?.id === id) {
        item.value = updatedItem
      }
      return updatedItem
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to update item with ID: ${id}.`)
      console.error(`Error in update(${id}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function remove(id: string | number) {
    setProcessingState(true)
    try {
      await repository.remove<T>(id)
      items.value = items.value.filter((i) => i.id !== id)
      if (item.value?.id === id) {
        item.value = null
      }
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to delete item with ID: ${id}.`)
      console.error(`Error in remove(${id}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function withdraw(id: string | null) {
    setProcessingState(true)
    try {
      const response = await repository.withdraw<any>(id)
      return response.data
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to withdraw item with ID: ${id}.`)
      console.error(`Error in withdraw (${id}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function submit(id: string | null) {
    setProcessingState(true)
    try {
      const response = await repository.submit<any>(id)
      return response.data
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to submit item with ID: ${id}.`)
      console.error(`Error in submit (${id}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function ongoing(companyId: string) {
    setProcessingState(true)
    try {
      const response = await repository.ongoing<any>(companyId)
      return response.data
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to fetch ongoing item with ID: ${companyId}.`)
      console.error(`Error in ongoing(${companyId}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  async function latestCompleted(companyId: string) {
    setProcessingState(true)
    try {
      const response = await repository.latestCompleted<any>(companyId)
      return response.data
    } catch (e: any) {
      setProcessingState(false, e.message || `Failed to fetch ongoing item with ID: ${companyId}.`)
      console.error(`Error in ongoing(${companyId}):`, e)
      throw e
    } finally {
      setProcessingState(false)
    }
  }

  const clearItem = () => {
    item.value = null
  }

  const clearItems = () => {
    items.value = []
    item.value = null
  }

  return {
    fetchAll,
    fetch,
    create,
    update,
    remove,
    withdraw,
    submit,
    ongoing,
    latestCompleted,
    clearItem,
    clearItems,
  }
}
