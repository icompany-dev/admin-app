import type { LabelItem } from "../models/LabelItem"

export interface IPropsPricingsModuleApplications {
  applications: LabelItem[]
  isShowing: boolean
}

export class PropsPricingsModuleApplications implements IPropsPricingsModuleApplications {
  applications: LabelItem[]
  isShowing: boolean

  constructor(labelItems: LabelItem[], isShowing: boolean) {
    this.applications = labelItems
    this.isShowing = isShowing
  }
}
