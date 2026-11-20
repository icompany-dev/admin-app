import type { Shareholder } from "../models/Shareholder"

export interface IPropsShareholderDetail {
  shareholder: Shareholder
}

export class PropsShareholderDetail implements IPropsShareholderDetail {
  shareholder: Shareholder

  constructor(shareholder: Shareholder) {
    this.shareholder = shareholder
  }
}
