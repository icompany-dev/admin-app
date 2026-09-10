export class GenerateDocumentDetails {
  filename: string = ""
  documentDate: string = ""
  noOfPages: number = 1

  constructor(filename: string, documentDate: string, noOfPages: number) {
    this.filename = filename
    this.documentDate = documentDate
    this.noOfPages = noOfPages
  }
}
