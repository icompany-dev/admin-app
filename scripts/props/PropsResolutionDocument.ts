import type { NameReservation } from "../types/NameReservation"

export interface IPropsResolutionDocument<T> {
  companyId: string
  applicationId: string | null
  application: T | null
  showWatermark: boolean
  watermarkText: string
  isInPreviewMode: boolean
  isByShareholder: boolean

  //custom values
  financialPeriodId: string | null
  bankId: string | null
  nameReservations: NameReservation[]
  yearToLodge: string | null
  type: string | null
  companyBankId: string | null

  isShowTag: boolean
}

export class PropsResolutionDocument<T> {
  companyId: string
  applicationId: string | null
  application: T | null
  showWatermark: boolean
  watermarkText: string
  isInPreviewMode: boolean
  isByShareholder: boolean
  financialPeriodId: string | null
  bankId: string | null
  nameReservations: NameReservation[]
  yearToLodge: string | null
  type: string | null
  isShowTag: boolean = true
  companyBankId: string | null = null

  constructor(
    companyId: string,
    applicationId: string | null,
    application: T | null,
    showWatermark: boolean,
    watermarkText: string,
    isInPreviewMode: boolean,
    isByShareholder: boolean,
    financialPeriodId: string | null = null,
    bankId: string | null = null,
    nameReservations: NameReservation[] = [],
    yearToLodge: string | null = null,
    type: string | null = null
  ) {
    this.companyId = companyId
    this.applicationId = applicationId
    this.application = application
    this.showWatermark = showWatermark
    this.watermarkText = watermarkText
    this.isInPreviewMode = isInPreviewMode
    this.isByShareholder = isByShareholder
    this.financialPeriodId = financialPeriodId
    this.bankId = bankId
    this.nameReservations = nameReservations
    this.yearToLodge = yearToLodge
    this.type = type
  }
}
