import { ActionTrayElement, type IActionTrayElementOptions } from "./ActionTrayElement"

export class ActionTrayDropdown extends ActionTrayElement {
  isOpen: boolean = false
  isDefaultOpen: boolean = false
  hasOpenOnce: boolean = false
  actions: ActionTrayElement[] = []

  constructor(
    id: string,
    options: Partial<IActionTrayElementOptions> = {},
    actions: ActionTrayElement[],
    isOpen: boolean = false
  ) {
    super(id, () => {}, options)
    this.setCta(this.toggle) // Only update Cta after super is constructed
    this.actions = actions
    this.isOpen = isOpen

    if (this.isOpen) {
      this.hasOpenOnce = false
      setTimeout(() => {
        this.hasOpenOnce = true
      }, 100)
    }
  }

  toggle(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen
    }
  }

  open(): void {
    if (!this.isDisabled) {
      this.isOpen = true
    }
  }

  close(): void {
    if (!this.isDisabled) {
      this.isOpen = false
    }
  }
}
