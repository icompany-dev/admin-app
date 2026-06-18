import { ActionTrayElement, ActionTrayElementParams } from "~/scripts/types/action-trays/ActionTrayElement"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { useLanguage } from "~/composables/useLanguage"
import { ActionTraySwitch } from "~/scripts/types/action-trays/ActionTraySwitch"
import { StringUtil } from "~/scripts/utils/String"

export class ActionTrayElementController {
  language = useLanguage()
  element: ActionTrayElement | any
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
    this.element = element
    this.optionSelected.value = element.selectedElementValue
  }

  onClick(): void {
    if (this.element.isDisabled || this.element.isSelectElement) {
      return
    }

    if (this.element.isSearchElement) {
      if (!this.isSearchOpen.value) {
        this.onSearchOpen()
        return
      }

      this.element.run(new ActionTrayElementParams(this.element.id, this.searchQuery.value))
      return
    }

    if (this.element instanceof ActionTraySwitch) {
      this.element.toggle()
      this.element.run(new ActionTrayElementParams(this.element.id, this.element.isActive))
      return
    }

    this.element.run(new ActionTrayElementParams(this.element.id, ""))
    if (this.element.isSearchElement) {
      this.emitEvents("onSearch")
    } else {
      this.emitEvents("onClick")
    }
  }

  onSelectChanged(): void {
    this.element.run(new ActionTrayElementParams(this.element.id, this.optionSelected.value))
  }

  onSwitchChange(): void {
    if (this.element instanceof ActionTraySwitch) {
      this.element.run(new ActionTrayElementParams(this.element.id, this.element.isActive))
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
    return this.element.subLabel.en !== "" && this.element.subLabel.bm !== ""
  }

  hasBadge(): boolean {
    if (!this.element.badge) {
      return false
    }

    return this.element.badge.en !== "" && this.element.badge.bm !== ""
  }

  isSwitchButtonVisible(): boolean {
    return this.element instanceof ActionTraySwitch
  }

  isSelectVisible(): boolean {
    if (this.element instanceof ActionTrayElement) {
      return this.element.isSelectElement
    }

    return false
  }

  isDropdownVisible(): boolean {
    if (this.element instanceof ActionTrayDropdown) {
      return this.element.isOpen
    }

    return false
  }

  isLabelVisible(): boolean {
    if (this.element instanceof ActionTrayDropdown) {
      return !this.element.isIconOnly
    }

    return true
  }

  getDropdownElements(): ActionTrayElement[] {
    if (this.element instanceof ActionTrayDropdown) {
      return this.element.actions
    }

    return []
  }

  getlabel(): string {
    return this.language.isMalay() ? this.element.label.bm : this.element.label.en
  }

  getSublabel(): string {
    if (!this.hasSublabel()) {
      return ""
    }

    return this.language.isMalay() ? this.element.subLabel.bm : this.element.subLabel.en
  }

  getBadge(): string {
    if (!this.hasBadge()) {
      return ""
    }

    return this.language.isMalay() ? this.element.badge.bm : this.element.badge.en
  }

  getIconClass(): string {
    if (this.element.isIconOnly) {
      return `icon-only ${this.element.iconClass}`
    }

    if (this.element instanceof ActionTrayDropdown) {
      if (StringUtil.isNullOrEmpty(this.element.iconClass)) {
        return this.element.isOpen ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down"
      }
    }

    return this.element.iconClass
  }

  handleClickOutside(event: MouseEvent | TouchEvent): void {
    if (!this.actionTrayElementRef) {
      return
    }

    if (this.actionTrayElementRef.contains(event.target as Node)) {
      return
    }

    if (this.element instanceof ActionTrayDropdown) {
      this.element.close()
    }
  }
}
