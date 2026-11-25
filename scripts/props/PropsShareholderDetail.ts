import type { Shareholder } from "../models/Shareholder"

export interface IPropsShareholderDetail {
  shareholder: Shareholder
  isEditable: boolean
}

export class PropsShareholderDetail implements IPropsShareholderDetail {
  shareholder: Shareholder
  isEditable: boolean = false

  constructor(shareholder: Shareholder) {
    this.shareholder = shareholder
  }
}
