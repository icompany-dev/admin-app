export class CompanyDocument {
  id: string = ""
  isSelected: boolean = false
  documentName: string = ""
  fileUrl: string | null = null
  isFromMyData: boolean = false
  documentDate: Date = new Date()
  isDisabled: boolean = false
  fileId: string = ""
  totalPages: number = 0
  isPriority: boolean = false

  constructor(
    id: string,
    isSelected: boolean,
    documentName: string,
    fileUrl: string | null,
    isFromMyData: boolean,
    documentDate: Date,
    fileId: string = "",
    totalPages: number = 1,
    isDisabled: boolean = false,
    isPriority: boolean = false
  ) {
    this.id = id
    this.isSelected = isSelected
    this.documentName = documentName
    this.fileUrl = fileUrl
    this.isFromMyData = isFromMyData
    this.documentDate = documentDate
    this.isDisabled = isDisabled
    this.fileId = fileId
    this.totalPages = totalPages > 0 ? totalPages : 1
    this.isPriority = isPriority
  }
}
