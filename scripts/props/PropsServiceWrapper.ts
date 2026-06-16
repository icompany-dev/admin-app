import { PaperOrientation } from "../constants/Paper"

export interface IPropsServiceWrapper {
  companyId: string
  target: string
  targetId: string | null
  isShowing: boolean
  isInPreviewMode: boolean
  isByShareholder: boolean

  financialYearStartDate: string
  financialYearEndDate: string
  showWatermarkText: boolean
  watermarkText: string
  yearToLodge: string
  paperOrientation: string
}

export class PropsServiceWrapper implements IPropsServiceWrapper {
  companyId: string
  target: string
  targetId: string | null
  isShowing: boolean
  isInPreviewMode: boolean
  isByShareholder: boolean
  financialYearStartDate: string = ""
  financialYearEndDate: string = ""
  showWatermarkText: boolean = false
  watermarkText: string = ""
  yearToLodge: string = ""
  paperOrientation: string = PaperOrientation.Portrait

  constructor(
    companyId: string,
    target: string,
    targetId: string | null,
    isShowing: boolean | null,
    isInPreviewMode: boolean | null,
    isByShareholder: boolean = false
  ) {
    this.companyId = companyId
    this.target = target
    this.targetId = targetId
    this.isShowing = isShowing ?? false
    this.isInPreviewMode = isInPreviewMode ?? true
    this.isByShareholder = isByShareholder
  }
}
