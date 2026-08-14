import { SelectOption } from "../SelectOption"

export class ActionTrayLabel {
  en: string
  bm: string

  constructor(en: string, bm: string) {
    this.en = en
    this.bm = bm
  }
}

export class ActionTrayElementParams {
  id: string
  outcome: any

  constructor(id: string, outcome: any) {
    this.id = id
    this.outcome = outcome
  }
}

export interface IActionTrayElementOptions {
  label: ActionTrayLabel
  subLabel: ActionTrayLabel
  iconClass: string
  isIconOnly: boolean
  isIconStart: boolean
  isDisabled: boolean
  isHidden: boolean
  isSearchElement: boolean
  isVisibleOnSearch: boolean
  isSelectElement: boolean
  selectedElementValue: string | number | null
  selectElementOptions: SelectOption[]
}

export class ActionTrayElement {
  id: string
  _cta: (params?: ActionTrayElementParams) => any | Promise<any>

  label: ActionTrayLabel
  subLabel: ActionTrayLabel
  iconClass: string
  isIconOnly: boolean
  isIconStart: boolean
  isDisabled: boolean
  isHidden: boolean
  isSearchElement: boolean
  isVisibleOnSearch: boolean
  isSelectElement: boolean
  selectedElementValue: string | number | null
  selectElementOptions: SelectOption[]

  constructor(
    id: string,
    cta: (params?: ActionTrayElementParams) => any | Promise<any>,
    options: Partial<IActionTrayElementOptions> = {}
  ) {
    this.id = id
    this._cta = cta

    this.label = options.label ?? new ActionTrayLabel("", "")
    this.subLabel = options.subLabel ?? new ActionTrayLabel("", "")
    this.iconClass = options.iconClass ?? ""
    this.isIconOnly = options.isIconOnly ?? false
    this.isIconStart = options.isIconStart ?? false
    this.isDisabled = options.isDisabled ?? false
    this.isHidden = options.isHidden ?? false
    this.isSearchElement = options.isSearchElement ?? false
    this.isVisibleOnSearch = options.isVisibleOnSearch ?? false
    this.isSelectElement = options.isSelectElement ?? false
    this.selectedElementValue = options.selectedElementValue ?? null
    this.selectElementOptions =
      options.selectElementOptions && Array.isArray(options.selectElementOptions) ? options.selectElementOptions : []
  }

  async run(param?: ActionTrayElementParams): Promise<any> {
    if (this.isDisabled) {
      return
    }

    return await this._cta(param)
  }

  setCta(cta: (param?: ActionTrayElementParams) => any | Promise<any>): void {
    this._cta = cta
  }

  setDisabled(val: boolean): void {
    this.isDisabled = val
  }

  setHidden(val: boolean): void {
    this.isHidden = val
  }
}
