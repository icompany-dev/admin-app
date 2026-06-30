import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { useLanguage } from "~/composables/useLanguage"

export class ActionTrayController {
  isScrolling = ref<boolean>(false)
  scrollTimeout: ReturnType<typeof setTimeout> | null = null
  language = useLanguage()
  eventManager = useEventManagerStore()
  isLockPosition: Ref<boolean> = ref<boolean>(false)
  isSearchOpen: Ref<boolean> = ref<boolean>(false)

  actions: Ref<any> = ref<ActionTrayElement[]>([])

  emitEvents: any | null = null

  constructor(actions: ActionTrayElement[], isLockPosition: boolean, emitEvents: any | null) {
    this.actions.value = actions
    this.isLockPosition.value = isLockPosition
    this.emitEvents = emitEvents
  }

  setActions(actions: ActionTrayElement[]): void {
    this.actions.value = actions
  }

  setIsLockPosition(isLockPosition: boolean) {
    this.isLockPosition.value = isLockPosition
  }

  getlabel(label: ActionTrayLabel): string {
    return this.language.isMalay() ? label.bm : label.en
  }

  onScrolling(): void {
    this.isScrolling.value = true
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling.value = false
    }, 500)
  }

  isHidden(): boolean {
    if (this.isLockPosition.value || this.isSearchOpen.value) {
      return false
    }

    return this.isScrolling.value
  }

  isSideBarOpen(): boolean {
    return this.eventManager.isSidebarOpen
  }

  onOpenSearch(): void {
    this.isSearchOpen.value = true
    this.eventManager.setIsHeaderSearchHidden(this.isSearchOpen.value)
  }

  onCloseSearch(): void {
    this.isSearchOpen.value = false
    this.eventManager.setIsHeaderSearchHidden(this.isSearchOpen.value)
    this.emitEvents("onCloseSearch")
  }
}
