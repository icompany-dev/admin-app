import { ActionTrayElement, ActionTrayElementParams, type IActionTrayElementOptions } from "./ActionTrayElement"

export class ActionTraySwitch extends ActionTrayElement {
  isActive: boolean = false
  
  constructor(
    id: string,
    cta: (params?: ActionTrayElementParams) => any | Promise<any>,
    options: Partial<IActionTrayElementOptions> = {},
    isActive: boolean,
  ) {
    super(id, cta, options)
    this.isActive = isActive
  }

  toggle(): void {
    if (!this.isDisabled) {
      this.isActive = !this.isActive
    }
  }
}