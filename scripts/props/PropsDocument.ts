import { PaperOrientation } from "../constants/Paper"

export interface IPropsDocument {
  id: string
  isSelected: boolean
  documentName: string
  fileUrl: string | null
  isFromMyData: boolean
  documentDate: Date
  isDisabled: boolean
  isShowDate: boolean
  isShowEnlarged: boolean
  isShowName: boolean
  canvasScale: number
  isStacked: boolean
  paperOrientation: PaperOrientation
}

export class PropsDocument implements IPropsDocument {
  id: string
  isSelected: boolean
  documentName: string
  fileUrl: string | null
  isFromMyData: boolean
  documentDate: Date
  isDisabled: boolean
  isShowDate: boolean = false
  isShowEnlarged: boolean = false
  isShowName: boolean = true
  canvasScale: number = 1
  isStacked: boolean = false
  paperOrientation: PaperOrientation = PaperOrientation.Portrait

  constructor(
    id: string,
    isSelected: boolean,
    documentName: string,
    fileUrl: string | null,
    isFromMyData: boolean,
    documentDate: Date,
    isDisabled: boolean
  ) {
    this.id = id
    this.isSelected = isSelected
    this.documentName = documentName
    this.fileUrl = fileUrl
    this.isFromMyData = isFromMyData
    this.documentDate = documentDate
    this.isDisabled = isDisabled
  }
}
