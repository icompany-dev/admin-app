export class PastBusinessTemplateItem {
  id: string = ""
  versionNo: string = ""
  isSelected: boolean = false
  name: string = ""
  nameBm: string = ""
  status: string = ""
  expiryDate: string = ""
  docxUrl: string = ""
  pdfUrl: string = ""
  purchaseDate: string | null = null

  constructor(data: Partial<PastBusinessTemplateItem> = {}) {
    Object.assign(this, data)
  }
}
