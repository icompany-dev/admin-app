export class BankChecklistItem {
  section: string = ""
  documentName: string = ""
  totalPages: number = 1
  fileUrl: string | null = null
  additionalInstructions: string[] = []
  isSelected: boolean = false

  constructor(
    section: string,
    documentName: string,
    totalPages: number,
    fileUrl: string | null = null,
    additionalInstructions: string[] = [],
    isSelected: boolean = false,
  ) {
    this.section = section
    this.documentName = documentName
    this.totalPages = totalPages
    this.fileUrl = fileUrl
    this.additionalInstructions = additionalInstructions
    this.isSelected = isSelected
  }
}
