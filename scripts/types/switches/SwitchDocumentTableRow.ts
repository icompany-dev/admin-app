import { DocumentHandoverItem } from "~/scripts/models/DocumentHandoverItem"

export class SwitchDocumentTableRow {
  number: string = ""
  isEmptyRow: boolean = false
  isSectionRow: boolean = false
  sectionTitle: string = ""
  document: DocumentHandoverItem | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    this.number = data.number ?? ""
    this.isEmptyRow = data.isEmptyRow ?? false
    this.isSectionRow = data.isSectionRow ?? false
    this.sectionTitle = data.sectionTitle ?? ""
    this.document = data.document ? new DocumentHandoverItem(data.document) : null

    Object.assign(data, this)
  }
}
