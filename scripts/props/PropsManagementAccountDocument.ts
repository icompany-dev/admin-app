export interface IPropsManagementAccountDocument {
  companyId: string
  financialYearStartDate: string
  financialYearEndDate: string
  companyManagementAccountId: string | null
  isDocumentEditable: boolean
  canEnlargeDocument: boolean
  isEnlarged: boolean
  isShowEarMark: boolean
  isForPrinting: boolean
  isShowAlert: boolean
}

export class PropsManagementAccountDocument implements IPropsManagementAccountDocument {
  companyId: string
  financialYearStartDate: string
  financialYearEndDate: string
  companyManagementAccountId: string | null
  isDocumentEditable: boolean
  canEnlargeDocument: boolean
  isEnlarged: boolean
  isShowEarMark: boolean
  isForPrinting: boolean
  isShowAlert: boolean

  constructor(
    companyId: string,
    financialYearStartDate: string,
    financialYearEndDate: string,
    companyManagementAccountId: string | null,
    isDocumentEditable: boolean,
    canEnlargeDocument: boolean,
    isEnlarged: boolean,
    isShowEarMark: boolean,
    isForPrinting: boolean,
    isShowAlert: boolean
  ) {
    this.companyId = companyId
    this.financialYearStartDate = financialYearStartDate
    this.financialYearEndDate = financialYearEndDate
    this.companyManagementAccountId = companyManagementAccountId
    this.isDocumentEditable = isDocumentEditable
    this.canEnlargeDocument = canEnlargeDocument
    this.isEnlarged = isEnlarged
    this.isShowEarMark = isShowEarMark
    this.isForPrinting = isForPrinting
    this.isShowAlert = isShowAlert
  }
}
