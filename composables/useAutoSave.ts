import { watch, type WatchSource } from "vue"
import { debounce } from "~/scripts/utils/UserBehaviour"

export const useAutoSave = (
  source: WatchSource | any,
  saveCallback: (data: any) => Promise<void> | void,
  delay = 1000
) => {
  const debouncedSave = debounce(async (newData: any) => {
    console.log("Idle detected. Triggering auto-save...")
    await saveCallback(newData)
  }, delay)

  watch(
    source,
    (newValue) => {
      debouncedSave(newValue)
    },
    { deep: true }
  )
}
