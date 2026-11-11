import { ActionTrayElement, ActionTrayElementParams } from "~/scripts/types/action-trays/ActionTrayElement"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { useLanguage } from "~/composables/useLanguage"
import { ActionTraySwitch } from "~/scripts/types/action-trays/ActionTraySwitch"
import { StringUtil } from "~/scripts/utils/String"

export class ActionTrayElementController {
  language = useLanguage()
  element: Ref<ActionTrayElement | any> = ref<ActionTrayElement | any>(null)
  isSearchOpen: Ref<boolean> = ref<boolean>(false)
  searchQuery: Ref<string> = ref<string>("")
  optionSelected: Ref<string | number | null> = ref<string | number | null>(null)

  actionTrayElementRef: any | null = null

  emitEvents: any | null = null

  constructor(element: ActionTrayElement, emitEvents: any | null) {
    this.setAction(element)
    this.emitEvents = emitEvents
  }

  setActionTrayElementRef(actionTrayElementRef: any): void {
    this.actionTrayElementRef = actionTrayElementRef
  }

  setAction(element: ActionTrayElement): void {
    this.element.value = element
    this.optionSelected.value = element.selectedElementValue
  }

  onClick(): void {
    if (this.element.value.isDisabled || this.element.value.isSelectElement) {
      return
    }

    if (this.element.value.isSearchElement) {
      if (!this.isSearchOpen.value) {
        this.onSearchOpen()
        return
      }

      this.element.value.run(new ActionTrayElementParams(this.element.value.id, this.searchQuery.value))
      return
    }

    if (this.element.value instanceof ActionTraySwitch) {
      this.element.value.toggle()
      this.element.value.run(new ActionTrayElementParams(this.element.value.id, this.element.value.isActive))
      return
    }

    this.element.value.run(new ActionTrayElementParams(this.element.value.id, ""))
    if (this.element.value.isSearchElement) {
      this.emitEvents("onSearch")
    } else {
      this.emitEvents("onClick")
    }
  }

  onSelectChanged(): void {
    this.element.value.run(new ActionTrayElementParams(this.element.value.id, this.optionSelected.value))
  }

  onSwitchChange(): void {
    if (this.element.value instanceof ActionTraySwitch) {
      this.element.value.run(new ActionTrayElementParams(this.element.value.id, this.element.value.isActive))
    }
  }

  onSearchOpen(): void {
    this.isSearchOpen.value = true
    this.emitEvents("openSearch")
  }

  onSearchClose(): void {
    this.isSearchOpen.value = false
    this.searchQuery.value = ""
    this.emitEvents("closeSearch")
  }

  hasSublabel(): boolean {
    return this.element.value.subLabel.en !== "" && this.element.value.subLabel.bm !== ""
  }

  hasBadge(): boolean {
    return this.element.value.badge.en !== "" && this.element.value.badge.bm !== ""
  }

  isSwitchButtonVisible(): boolean {
    return this.element.value instanceof ActionTraySwitch
  }

  isSelectVisible(): boolean {
    if (this.element.value instanceof ActionTrayElement) {
      return this.element.value.isSelectElement
    }

    return false
  }

  isDropdownVisible(): boolean {
    if (this.element.value instanceof ActionTrayDropdown) {
      return this.element.value.isOpen
    }

    return false
  }

  isLabelVisible(): boolean {
    if (this.element.value instanceof ActionTrayDropdown) {
      return !this.element.value.isIconOnly
    }

    return true
  }

  getDropdownElements(): ActionTrayElement[] {
    if (this.element.value instanceof ActionTrayDropdown) {
      return this.element.value.actions
    }

    return []
  }

  getlabel(): string {
    return this.language.isMalay() ? this.element.value.label.bm : this.element.value.label.en
  }

  getSublabel(): string {
    if (!this.hasSublabel()) {
      return ""
    }

    return this.language.isMalay() ? this.element.value.subLabel.bm : this.element.value.subLabel.en
  }

  getBadge(): string {
    if (!this.hasBadge()) {
      return ""
    }

    return this.language.isMalay() ? this.element.value.badge.bm : this.element.value.badge.en
  }

  getIconClass(): string {
    if (this.element.value.isIconOnly) {
      return `icon-only ${this.element.value.iconClass}`
    }

    if (this.element.value instanceof ActionTrayDropdown) {
      if (StringUtil.isNullOrEmpty(this.element.value.iconClass)) {
        return this.element.value.isOpen ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down"
      }
    }

    return this.element.value.iconClass
  }

  handleClickOutside(event: MouseEvent | TouchEvent): void {
    if (!this.actionTrayElementRef) {
      return
    }

    if (this.actionTrayElementRef.contains(event.target as Node)) {
      return
    }

    if (this.element.value instanceof ActionTrayDropdown) {
      if (this.element.value.isDefaultOpen && !this.element.value.hasOpenOnce) {
        return
      }

      this.element.value.close()
    }
  }
}
